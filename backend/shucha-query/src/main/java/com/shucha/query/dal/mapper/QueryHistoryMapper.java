package com.shucha.query.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QueryHistoryMapper extends BaseMapper<QueryHistoryDO> {
}
