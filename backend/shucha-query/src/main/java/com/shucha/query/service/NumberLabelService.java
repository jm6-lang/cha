package com.shucha.query.service;

import com.shucha.query.api.dto.NumberLabelRespDTO;

/**
 * 号码标记数据源抽象
 * <p>
 * 真实数据源对接时新增实现类即可，如：
 * - AliyunNumberLabelServiceImpl
 * - TencentNumberLabelServiceImpl
 * 通过 application.yml 中的 shucha.query.provider 配置切换
 */
public interface NumberLabelService {

    /**
     * 查询号码标记信息
     *
     * @param number 手机号/固话/400/95 号码
     * @return 标记结果
     */
    NumberLabelRespDTO query(String number);

    /**
     * 数据源名称（用于日志/路由）
     */
    String providerName();
}
