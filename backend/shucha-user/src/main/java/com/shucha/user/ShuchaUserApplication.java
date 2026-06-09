package com.shucha.user;

import com.shucha.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
@RequestMapping("/api/user")
@Tag(name = "用户")
public class ShuchaUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShuchaUserApplication.class, args);
    }

    @Operation(summary = "获取用户信息（演示版）")
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getUser(@PathVariable Long id) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", id);
        data.put("nickname", "演示用户");
        data.put("avatar", "");
        data.put("phone", "138****0000");
        data.put("level", "VIP1");
        return Result.success(data);
    }
}
