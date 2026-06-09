package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.service.NumberLabelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 淘宝手机号归属地查询（免费公开 API）
 * <p>
 * 接口地址：http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13800138000
 * 特点：免费、无需鉴权、但有 QPS 限制（建议 < 10 QPS）
 * 局限：只能查归属地 + 运营商，无骚扰标记
 * <p>
 * 注意：淘宝该接口长期可用性不稳定，建议作为兜底
 */
@Slf4j
@Service
public class TaobaoNumberLabelServiceImpl implements NumberLabelService {

    private static final String API_URL = "http://tcc.taobao.com/cc/json/mobile_tel_segment.htm";

    /**
     * 是否可用
     * （目前是免费 API，无密钥要求，默认 true）
     */
    public boolean isAvailable() {
        return true;
    }

    @Override
    public NumberLabelRespDTO query(String number) {
        if (number == null || number.length() < 7) {
            return NumberLabelRespDTO.builder()
                    .number(number)
                    .labels(java.util.Collections.emptyList())
                    .build();
        }

        log.debug("[Taobao] query number: {}", number);

        try {
            String url = API_URL + "?tel=" + number;
            // 实际生产建议用 RestTemplate 或 WebClient
            // 这里给出骨架，由调用方注入 HTTP 客户端
            String rawJson = simpleHttpGet(url);

            // 解析淘宝返回的 JSON（淘宝返回 _taobao 比如：__GetZoneResult_ = {...}）
            return parseTaobaoResponse(number, rawJson);

        } catch (Exception e) {
            log.warn("[Taobao] query failed: {}", e.getMessage());
            throw new RuntimeException("Taobao API error: " + e.getMessage(), e);
        }
    }

    @Override
    public String providerName() {
        return "taobao";
    }

    /**
     * 简单 HTTP GET
     * 生产环境应使用 Spring 的 RestTemplate 或 WebClient
     * 这里用 JDK 自带 URLConnection 避免额外依赖
     */
    private String simpleHttpGet(String url) throws Exception {
        java.net.HttpURLConnection conn = (java.net.HttpURLConnection)
                new java.net.URL(url).openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(3000);
        conn.setReadTimeout(3000);
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");
        conn.setRequestProperty("Referer", "https://www.taobao.com/");

        try (java.io.InputStream is = conn.getInputStream();
             java.io.BufferedReader br = new java.io.BufferedReader(
                     new java.io.InputStreamReader(is, "GBK"))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    /**
     * 解析淘宝返回结果
     * 格式：__GetZoneResult_ = {"mts":"1380013","province":"北京","catName":"中国移动","telString":"13800138000","areaVid":"29400","ispVid":"3230139","carrier":"北京移动"}
     */
    private NumberLabelRespDTO parseTaobaoResponse(String number, String raw) {
        // 简化的字符串解析
        if (raw == null || !raw.contains("__GetZoneResult_")) {
            throw new RuntimeException("Invalid response: " + raw);
        }

        String province = extractValue(raw, "province");
        String carrier = extractValue(raw, "catName");

        return NumberLabelRespDTO.builder()
                .number(number)
                .province(province)
                .city(province) // 淘宝只返回省份
                .carrier(carrier)
                .labels(java.util.Collections.emptyList()) // 淘宝无标记
                .build();
    }

    private String extractValue(String json, String key) {
        int idx = json.indexOf("\"" + key + "\":\"");
        if (idx < 0) return null;
        int start = idx + key.length() + 4;
        int end = json.indexOf("\"", start);
        return end > start ? json.substring(start, end) : null;
    }
}
