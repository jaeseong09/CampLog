package com.camplog.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class SessionEndResponse {
    private Long id;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer duration;
    private Integer focusScore;
    private Integer pauseCount;
    private List<String> newlyUnlockedItems; // 이번 세션으로 해금된 아이템 목록
}