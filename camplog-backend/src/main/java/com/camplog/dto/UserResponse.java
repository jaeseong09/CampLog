package com.camplog.dto;

import com.camplog.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String nickname;
    private String avatarType;
    private Long totalStudyTime; // 분 단위

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .avatarType(user.getAvatarType())
                .totalStudyTime(user.getTotalStudyTime())
                .build();
    }
}