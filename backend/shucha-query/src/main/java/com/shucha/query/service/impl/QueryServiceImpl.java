package com.shucha.query.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.shucha.query.api.dto.NumberLabelRespDTO;
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

    @Override
    public NumberLabelRespDTO queryNumber(String number, Long userId) {
        NumberLabelRespDTO result = numberLabelService.query(number);

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
            log.warn("write query history failed", e);
        }

        return result;
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
