package com.shucha.query.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("query_history")
public class QueryHistoryDO {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String number;
    private String province;
    private String city;
    private String carrier;
    private Integer labelCount;
    private Long userId;
    private String providerName;
    private LocalDateTime createTime;
}
