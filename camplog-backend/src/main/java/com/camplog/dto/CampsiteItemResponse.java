package com.camplog.dto;

import com.camplog.entity.CampsiteItem;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CampsiteItemResponse {
    private String itemType;
    private LocalDateTime unlockedAt;

    public static CampsiteItemResponse from(CampsiteItem item) {
        return CampsiteItemResponse.builder()
                .itemType(item.getItemType())
                .unlockedAt(item.getUnlockedAt())
                .build();
    }
}