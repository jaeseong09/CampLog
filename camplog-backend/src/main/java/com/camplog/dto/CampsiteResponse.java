package com.camplog.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CampsiteResponse {
    private Long totalStudyTime;          // 누적 공부 시간 (분)
    private Long nextUnlockMinutes;       // 다음 해금까지 남은 시간 (null = 모두 해금)
    private List<CampsiteItemResponse> unlockedItems;
}