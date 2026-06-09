package com.shucha.query.controller;

import com.shucha.common.constant.CommonConstant;
import com.shucha.common.result.Result;
import com.shucha.query.api.dto.NumberLabelRespDTO;
import com.shucha.query.dal.dataobject.QueryHistoryDO;
import com.shucha.query.service.QueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "号码查询")
@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @Operation(summary = "查询号码标记")
    @GetMapping("/number-label")
    public Result<NumberLabelRespDTO> queryNumberLabel(
            @RequestParam("number") String number,
            HttpServletRequest request) {
        Long userId = parseUserId(request);
        return Result.success(queryService.queryNumber(number, userId));
    }

    @Operation(summary = "查询历史")
    @GetMapping("/history")
    public Result<List<QueryHistoryDO>> listHistory(
            @RequestParam(value = "limit", required = false) Integer limit,
            HttpServletRequest request) {
        Long userId = parseUserId(request);
        return Result.success(queryService.listHistory(userId, limit));
    }

    private Long parseUserId(HttpServletRequest request) {
        String header = request.getHeader(CommonConstant.HEADER_USER_ID);
        return header == null ? null : Long.valueOf(header);
    }
}
