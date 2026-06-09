package com.shucha.common.result;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一返回结构")
public class Result<T> {
    @Schema(description = "业务码：0=成功")
    private Integer code;
    @Schema(description = "提示信息")
    private String message;
    @Schema(description = "业务数据")
    private T data;

    public static <T> Result<T> success() {
        return new Result<>(0, "ok", null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(0, "ok", data);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}
