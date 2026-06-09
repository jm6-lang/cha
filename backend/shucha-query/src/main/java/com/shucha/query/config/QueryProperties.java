package com.shucha.query.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * 数据源配置属性
 * <p>
 * application.yml 配置示例：
 * <pre>
 * shucha:
 *   query:
 *     providers:
 *       - taobao
 *       - mock
 *     cache:
 *       enabled: true
 *       ttl-days: 30
 *     aliyun:
 *       access-key-id: xxx
 *       access-key-secret: xxx
 *       auth-code: xxx
 * </pre>
 */
@Data
@ConfigurationProperties(prefix = "shucha.query")
public class QueryProperties {

    /**
     * 启用的数据源列表（按顺序）
     * 可选：mock, taobao, aliyun
     */
    private List<String> providers = List.of("mock");

    /**
     * 缓存配置
     */
    private Cache cache = new Cache();

    /**
     * 阿里云号码百科配置
     */
    private Aliyun aliyun = new Aliyun();

    @Data
    public static class Cache {
        /** 是否启用 Redis 缓存 */
        private boolean enabled = true;
        /** 缓存有效期（天） */
        private int ttlDays = 30;
    }

    @Data
    public static class Aliyun {
        private String accessKeyId;
        private String accessKeySecret;
        private String authCode;
        private String endpoint = "dytnsapi.aliyuncs.com";
    }
}
