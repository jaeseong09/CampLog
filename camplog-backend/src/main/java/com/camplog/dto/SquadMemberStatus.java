package com.camplog.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SquadMemberStatus {
    private Long userId;
    private String nickname;
    private String avatarType;
    private Long totalStudyTime;  // 누적 공부 시간 (분)
    private boolean isStudying;   // 현재 세션 진행 중 여부
    private Long activeSessionId; // 진행 중인 세션 id (isStudying=true 일 때만)
}