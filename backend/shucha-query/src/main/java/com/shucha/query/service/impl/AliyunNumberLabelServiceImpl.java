package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.config.QueryProperties;
import com.shucha.query.service.NumberLabelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 阿里云号码百科适配
 * <p>
 * 需配置：
 * - aliyun.access-key-id
 * - aliyun.access-key-secret
 * - aliyun.auth-code（在号码百科控制台申请）
 * <p>
 * 费用：约 ¥0.01/次（按次计费）
 * QPS 限制：2000 次/秒
 * 能力：归属地 + 携号转网 + 基础运营商 + 转售企业
 */
@Slf4j
@Service
public class AliyunNumberLabelServiceImpl implements NumberLabelService {

    private final QueryProperties properties;

    public AliyunNumberLabelServiceImpl(QueryProperties properties) {
        this.properties = properties;
    }

    /**
     * 是否可用（凭证是否完整）
     */
    public boolean isAvailable() {
        QueryProperties.Aliyun cfg = properties.getAliyun();
        return cfg.getAccessKeyId() != null
                && !cfg.getAccessKeyId().isEmpty()
                && cfg.getAccessKeySecret() != null
                && !cfg.getAccessKeySecret().isEmpty()
                && cfg.getAuthCode() != null
                && !cfg.getAuthCode().isEmpty();
    }

    @Override
    public NumberLabelRespDTO query(String number) {
        if (number == null || number.length() < 7) {
            return NumberLabelRespDTO.builder()
                    .number(number)
                    .labels(Collections.emptyList())
                    .build();
        }

        log.debug("[Aliyun] query number: {}", number);

        // TODO: 接入阿里云 OpenAPI SDK
        // 参考文档：https://help.aliyun.com/zh/cpns/developer-reference/api-dytnsapi-2020-02-17-describephonenumberoperatorattribute
        //
        // 接入步骤：
        // 1. pom.xml 添加依赖
        //    <dependency>
        //        <groupId>com.aliyun</groupId>
        //        <artifactId>dytnsapi20200217</artifactId>
        //        <version>1.0.0</version>
        //    </dependency>
        // 2. 创建 Client
        //    com.aliyun.dytnsapi20200217.Client client = new com.aliyun.dytnsapi20200217.Client(
        //        new com.aliyun.teaopenapi.models.Config()
        //            .setAccessKeyId(cfg.getAccessKeyId())
        //            .setAccessKeySecret(cfg.getAccessKeySecret())
        //            .setEndpoint(cfg.getEndpoint())
        //    );
        // 3. 调用 DescribePhoneNumberOperatorAttribute
        //    DescribePhoneNumberOperatorAttributeRequest req = new DescribePhoneNumberOperatorAttributeRequest()
        //        .setInputNumber(number)
        //        .setAuthCode(cfg.getAuthCode())
        //        .setMask("NORMAL");
        //    DescribePhoneNumberOperatorAttributeResponse resp = client.describePhoneNumberOperatorAttribute(req);
        // 4. 解析返回的 Data 字段：
        //    - BasicCarrier：中国移动/联通/电信/广电
        //    - NumberSegment：号段
        //    - Province：省份
        //    - City：城市
        //    - NumberChange：是否携号转网

        throw new UnsupportedOperationException(
                "Aliyun integration not yet implemented. " +
                "Add dytnsapi SDK and implement query logic. " +
                "See TODO comments in this file.");
    }

    @Override
    public String providerName() {
        return "aliyun";
    }
}
