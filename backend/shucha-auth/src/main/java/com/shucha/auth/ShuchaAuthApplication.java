package com.shucha.auth;

import com.shucha.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证")
public class ShuchaAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShuchaAuthApplication.class, args);
    }

    @Operation(summary = "发送验证码（演示版：固定返回 9999）")
    @PostMapping("/sms-code")
    public Result<Map<String, String>> sendSmsCode(@RequestParam String phone) {
        Map<String, String> data = new HashMap<>();
        data.put("phone", phone);
        data.put("hint", "演示模式：验证码固定 9999");
        return Result.success(data);
    }

    @Operation(summary = "登录（演示版：任何手机号 + 9999 即可登录）")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(
            @RequestParam String phone,
            @RequestParam String code) {
        if (!"9999".equals(code)) {
            return Result.error(401, "验证码错误，演示版固定 9999");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("userId", 10001);
        data.put("nickname", "演示用户");
        data.put("token", "mock-token-" + System.currentTimeMillis());
        return Result.success(data);
    }
}
