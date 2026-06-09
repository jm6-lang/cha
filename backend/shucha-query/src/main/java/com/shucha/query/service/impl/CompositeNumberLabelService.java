package com.shucha.query.service.impl;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.service.NumberLabelService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 组合数据源：按顺序尝试每个数据源，失败则降级到下一个
 * <p>
 * 典型场景：taobao 失败 → 降级 mock
 */
@Slf4j
public class CompositeNumberLabelService implements NumberLabelService {

    private final List<NumberLabelService> providers;
    private final String name;

    public CompositeNumberLabelService(List<NumberLabelService> providers) {
        this.providers = providers;
        this.name = "composite(" + String.join(",",
                providers.stream().map(NumberLabelService::providerName).toList()) + ")";
    }

    @Override
    public NumberLabelRespDTO query(String number) {
        for (NumberLabelService provider : providers) {
            try {
                long start = System.currentTimeMillis();
                NumberLabelRespDTO result = provider.query(number);
                long cost = System.currentTimeMillis() - start;

                if (result == null) {
                    log.warn("[DataSource] {} returned null, trying next", provider.providerName());
                    continue;
                }

                log.info("[DataSource] {} success in {}ms", provider.providerName(), cost);
                return result;

            } catch (Exception e) {
                log.warn("[DataSource] {} failed: {}, trying next",
                        provider.providerName(), e.getMessage());
            }
        }

        // 理论上兜底 mock 一定存在
        throw new IllegalStateException("No data source available for number: " + number);
    }

    @Override
    public String providerName() {
        return name;
    }
}
