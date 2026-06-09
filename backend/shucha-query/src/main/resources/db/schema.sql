CREATE TABLE IF NOT EXISTS query_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(32) NOT NULL COMMENT '查询号码',
    province VARCHAR(32) COMMENT '省份',
    city VARCHAR(64) COMMENT '城市',
    carrier VARCHAR(32) COMMENT '运营商',
    label_count INT DEFAULT 0 COMMENT '标签数',
    user_id BIGINT COMMENT '用户ID(可空,匿名查询)',
    provider_name VARCHAR(32) COMMENT '数据源',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_number (number),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='号码查询历史';
