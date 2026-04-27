package com.camplog.dto;

import com.camplog.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RankingResponse {
    private int rank;
    private Long userId;
    private String nickname;
    private String avatarType;
    private Long studyMinutes;  // 해당 기간 공부 시간(분)

    public static RankingResponse of(int rank, User user, Long studyMinutes) {
        return RankingResponse.builder()
                .rank(rank)
                .userId(user.getId())
                .nickname(user.getNickname())
                .avatarType(user.getAvatarType())
                .studyMinutes(studyMinutes)
                .build();
    }
}