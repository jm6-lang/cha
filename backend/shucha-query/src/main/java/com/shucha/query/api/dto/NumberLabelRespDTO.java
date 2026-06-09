package com.shucha.query.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "号码标记结果")
public class NumberLabelRespDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    @Schema(description = "号码")
    private String number;
    @Schema(description = "省份")
    private String province;
    @Schema(description = "城市")
    private String city;
    @Schema(description = "运营商")
    private String carrier;
    @Schema(description = "标记列表")
    private List<Label> labels;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Label implements Serializable {
        private static final long serialVersionUID = 1L;
        @Schema(description = "标签名，如 骚扰电话/广告推销/快递外卖")
        private String name;
        @Schema(description = "标记来源平台")
        private String source;
        @Schema(description = "标记次数")
        private Integer count;
        @Schema(description = "风险等级 1=低 2=中 3=高")
        private Integer riskLevel;
    }
}
