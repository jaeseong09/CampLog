package com.camplog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SessionEndRequest {
    @NotNull @Min(0) @Max(100)
    private Integer focusScore;

    @NotNull @Min(0)
    private Integer pauseCount;
}