package com.camplog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SessionStartResponse {
    private Long id;
    private LocalDateTime startedAt;
}