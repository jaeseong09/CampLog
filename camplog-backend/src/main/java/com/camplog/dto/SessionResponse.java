package com.camplog.dto;

import com.camplog.entity.StudySession;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SessionResponse {
    private Long id;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer duration;    // 분 단위
    private Integer focusScore;
    private Integer pauseCount;

    public static SessionResponse from(StudySession session) {
        return SessionResponse.builder()
                .id(session.getId())
                .startedAt(session.getStartedAt())
                .endedAt(session.getEndedAt())
                .duration(session.getDuration())
                .focusScore(session.getFocusScore())
                .pauseCount(session.getPauseCount())
                .build();
    }
}