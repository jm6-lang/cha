package com.shucha.query;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
@MapperScan("com.shucha.query.dal.mapper")
public class ShuchaQueryApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShuchaQueryApplication.class, args);
    }
}
