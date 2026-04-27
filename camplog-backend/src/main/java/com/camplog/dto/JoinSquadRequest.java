package com.camplog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class JoinSquadRequest {
    @NotBlank
    private String inviteCode;
}