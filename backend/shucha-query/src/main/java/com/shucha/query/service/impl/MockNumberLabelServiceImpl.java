package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.api.dto.NumberLabelRespDTO.Label;
import com.shucha.query.service.NumberLabelService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Mock 数据源：基于号码哈希规则生成稳定结果
 * <p>
 * 设计要点：
 * 1. 相同号码永远返回相同结果（基于 hashCode）
 * 2. 真实数据源对接时只需新增一个实现，通过 @ConditionalOnProperty 切换
 */
@Slf4j
@Service
public class MockNumberLabelServiceImpl implements NumberLabelService {

    private static final List<String> CARRIERS = Arrays.asList("中国移动", "中国联通", "中国电信");
    private static final List<String> PROVINCES = Arrays.asList(
            "北京", "上海", "广东", "江苏", "浙江", "四川", "湖北", "陕西", "辽宁", "山东"
    );
    private static final List<String> LABEL_NAMES = Arrays.asList(
            "骚扰电话", "广告推销", "快递外卖", "诈骗电话", "房产中介", "保险理财", "企业客服"
    );
    private static final List<String> SOURCES = Arrays.asList(
            "腾讯手机管家", "360手机卫士", "百度手机卫士", "阿里钱盾", "触宝电话"
    );

    @Override
    public NumberLabelRespDTO query(String number) {
        log.info("[Mock] query number label: {}", number);

        if (number == null || number.length() < 7) {
            return NumberLabelRespDTO.builder()
                    .number(number)
                    .labels(new ArrayList<>())
                    .build();
        }

        int seed = Math.abs(number.hashCode());
        Random rnd = new Random(seed);

        String carrier = CARRIERS.get(seed % CARRIERS.size());
        String province = PROVINCES.get((seed / 7) % PROVINCES.size());
        String city = province + "市";

        int labelCount = rnd.nextInt(5);
        List<Label> labels = new ArrayList<>();
        for (int i = 0; i < labelCount; i++) {
            String name = LABEL_NAMES.get(rnd.nextInt(LABEL_NAMES.size()));
            String source = SOURCES.get(rnd.nextInt(SOURCES.size()));
            int count = 1 + rnd.nextInt(200);
            int risk = 1 + rnd.nextInt(3);
            labels.add(Label.builder()
                    .name(name)
                    .source(source)
                    .count(count)
                    .riskLevel(risk)
                    .build());
        }

        return NumberLabelRespDTO.builder()
                .number(number)
                .province(province)
                .city(city)
                .carrier(carrier)
                .labels(labels)
                .build();
    }

    @Override
    public String providerName() {
        return "mock";
    }
}
