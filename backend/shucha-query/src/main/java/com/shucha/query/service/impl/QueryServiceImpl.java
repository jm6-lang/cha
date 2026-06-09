package com.shucha.query.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.cache.NumberLabelCache;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import com.shucha.query.dal.mapper.QueryHistoryMapper;
import com.shucha.query.service.NumberLabelService;
import com.shucha.query.service.QueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryServiceImpl implements QueryService {

    private final NumberLabelService numberLabelService;
    private final QueryHistoryMapper historyMapper;
    private final NumberLabelCache cache;

    @Override
    public NumberLabelRespDTO queryNumber(String number, Long userId) {
        // 1. 查缓存
        NumberLabelRespDTO result = cache.get(number);
        boolean fromCache = false;
        if (result != null) {
            log.info("[Query] cache hit for {}", number);
            fromCache = true;
        } else {
            // 2. 缓存未命中，调用数据源（多源自动降级）
            result = numberLabelService.query(number);
            // 3. 写缓存
            cache.put(number, result);
        }

        // 4. 写历史（异步，失败不影响主流程）
        if (!fromCache) {
            writeHistoryAsync(number, result, userId);
        } else {
            // 缓存命中也快速记录
            writeHistoryAsync(number, result, userId);
        }

        return result;
    }

    private void writeHistoryAsync(String number, NumberLabelRespDTO result, Long userId) {
        try {
            QueryHistoryDO history = new QueryHistoryDO();
            history.setNumber(result.getNumber());
            history.setProvince(result.getProvince());
            history.setCity(result.getCity());
            history.setCarrier(result.getCarrier());
            history.setLabelCount(result.getLabels() == null ? 0 : result.getLabels().size());
            history.setUserId(userId);
            history.setProviderName(numberLabelService.providerName());
            history.setCreateTime(LocalDateTime.now());
            historyMapper.insert(history);
        } catch (Exception e) {
            log.warn("[Query] write history failed", e);
        }
    }

    @Override
    public List<QueryHistoryDO> listHistory(Long userId, Integer limit) {
        if (userId == null) {
            return Collections.emptyList();
        }
        int actualLimit = limit == null ? 20 : limit;
        return historyMapper.selectList(
                new QueryWrapper<QueryHistoryDO>()
                        .eq("user_id", userId)
                        .orderByDesc("create_time")
                        .last("limit " + actualLimit)
        );
    }
}
