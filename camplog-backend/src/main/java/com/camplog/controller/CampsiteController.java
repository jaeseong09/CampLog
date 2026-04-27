package com.camplog.controller;

import com.camplog.dto.CampsiteItemResponse;
import com.camplog.dto.CampsiteResponse;
import com.camplog.service.CampsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/campsite")
@RequiredArgsConstructor
public class CampsiteController {

    private final CampsiteService campsiteService;

    // 캠프사이트 현황 (totalStudyTime, 다음 해금까지 남은 시간, 해금된 아이템 목록)
    @GetMapping
    public ResponseEntity<CampsiteResponse> getCampsite(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(campsiteService.getCampsite(userDetails.getUsername()));
    }

    // 해금된 아이템 목록만 조회
    @GetMapping("/items")
    public ResponseEntity<List<CampsiteItemResponse>> getItems(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(campsiteService.getCampsite(userDetails.getUsername()).getUnlockedItems());
    }
}