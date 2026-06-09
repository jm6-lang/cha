package com.shucha.query.service;

import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.dal.dataobject.QueryHistoryDO;

import java.util.List;

public interface QueryService {
    NumberLabelRespDTO queryNumber(String number, Long userId);

    List<QueryHistoryDO> listHistory(Long userId, Integer limit);
}
