package com.shucha.query.config;

import com.shucha.query.service.NumberLabelService;
import com.shucha.query.service.impl.AliyunNumberLabelServiceImpl;
import com.shucha.query.service.impl.CompositeNumberLabelService;
import com.shucha.query.service.impl.MockNumberLabelServiceImpl;
import com.shucha.query.service.impl.TaobaoNumberLabelServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据源配置
 * <p>
 * 通过 shucha.query.providers 配置启用的数据源列表（按顺序）
 * 默认会包含 mock 兜底，确保返回永远不为空
 */
@Slf4j
@Configuration
public class DataSourceConfig {

    /**
     * 查询服务属性
     */
    @Bean
    @ConfigurationProperties(prefix = "shucha.query")
    public QueryProperties queryProperties() {
        return new QueryProperties();
    }

    /**
     * 默认数据源 Bean
     * <p>
     * - mock: 永远启用，作为最后兜底
     * - 其他按配置顺序启用
     */
    @Bean
    public NumberLabelService numberLabelService(
            QueryProperties properties,
            MockNumberLabelServiceImpl mockService,
            TaobaoNumberLabelServiceImpl taobaoService,
            AliyunNumberLabelServiceImpl aliyunService) {

        List<NumberLabelService> providers = new ArrayList<>();
        List<String> configured = properties.getProviders() == null
                ? List.of("mock")
                : properties.getProviders();

        for (String name : configured) {
            switch (name.toLowerCase()) {
                case "mock" -> {
                    providers.add(mockService);
                    log.info("[DataSource] enabled: mock");
                }
                case "taobao" -> {
                    if (taobaoService.isAvailable()) {
                        providers.add(taobaoService);
                        log.info("[DataSource] enabled: taobao");
                    } else {
                        log.warn("[DataSource] taobao configured but not available, skipped");
                    }
                }
                case "aliyun" -> {
                    if (aliyunService.isAvailable()) {
                        providers.add(aliyunService);
                        log.info("[DataSource] enabled: aliyun");
                    } else {
                        log.warn("[DataSource] aliyun configured but credentials missing, skipped");
                    }
                }
                default -> log.warn("[DataSource] unknown provider: {}, skipped", name);
            }
        }

        // 兜底：确保至少有一个 mock
        boolean hasMock = providers.stream().anyMatch(p -> "mock".equals(p.providerName()));
        if (!hasMock) {
            log.info("[DataSource] auto-adding mock as fallback");
            providers.add(mockService);
        }

        log.info("[DataSource] total {} providers active: {}",
                providers.size(),
                providers.stream().map(NumberLabelService::providerName).toList());

        return new CompositeNumberLabelService(providers);
    }
}
