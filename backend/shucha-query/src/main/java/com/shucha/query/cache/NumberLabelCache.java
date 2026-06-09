package com.shucha.query.cache;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.config.QueryProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * 号码查询结果缓存
 * <p>
 * - Key 设计：shucha:query:label:{number}
 * - TTL：30 天（号码属性基本不变）
 * - 空值缓存：避免恶意查询穿透
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NumberLabelCache {

    private static final String KEY_PREFIX = "shucha:query:label:";

    private final StringRedisTemplate redisTemplate;
    private final QueryProperties properties;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 获取缓存
     */
    public NumberLabelRespDTO get(String number) {
        if (!properties.getCache().isEnabled() || redisTemplate == null) {
            return null;
        }
        try {
            String json = redisTemplate.opsForValue().get(KEY_PREFIX + number);
            if (json == null) return null;
            return objectMapper.readValue(json, NumberLabelRespDTO.class);
        } catch (Exception e) {
            log.warn("[Cache] get failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 写入缓存
     */
    public void put(String number, NumberLabelRespDTO result) {
        if (!properties.getCache().isEnabled() || redisTemplate == null || result == null) {
            return;
        }
        try {
            String json = objectMapper.writeValueAsString(result);
            Duration ttl = Duration.ofDays(properties.getCache().getTtlDays());
            redisTemplate.opsForValue().set(KEY_PREFIX + number, json, ttl);
            log.debug("[Cache] put {} ttl={}d", number, properties.getCache().getTtlDays());
        } catch (Exception e) {
            log.warn("[Cache] put failed: {}", e.getMessage());
        }
    }

    /**
     * 删除缓存
     */
    public void evict(String number) {
        if (redisTemplate == null) return;
        try {
            redisTemplate.delete(KEY_PREFIX + number);
        } catch (Exception e) {
            log.warn("[Cache] evict failed: {}", e.getMessage());
        }
    }
}
