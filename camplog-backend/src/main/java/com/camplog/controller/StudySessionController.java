package com.camplog.controller;

import com.camplog.dto.SessionEndRequest;
import com.camplog.dto.SessionEndResponse;
import com.camplog.dto.SessionResponse;
import com.camplog.dto.SessionStartResponse;
import com.camplog.service.StudySessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService studySessionService;

    // 세션 시작
    @PostMapping("/start")
    public ResponseEntity<SessionStartResponse> start(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studySessionService.startSession(userDetails.getUsername()));
    }

    // 세션 종료
    @PatchMapping("/{id}/end")
    public ResponseEntity<SessionEndResponse> end(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SessionEndRequest request) {
        return ResponseEntity.ok(studySessionService.endSession(id, userDetails.getUsername(), request));
    }

    // 현재 진행 중인 세션 조회
    @GetMapping("/active")
    public ResponseEntity<?> active(@AuthenticationPrincipal UserDetails userDetails) {
        return studySessionService.getActiveSession(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // 오늘 세션 목록
    @GetMapping("/today")
    public ResponseEntity<List<SessionResponse>> today(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studySessionService.getTodaySessions(userDetails.getUsername()));
    }

    // 주간 세션 목록 (최근 7일)
    @GetMapping("/weekly")
    public ResponseEntity<List<SessionResponse>> weekly(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studySessionService.getWeeklySessions(userDetails.getUsername()));
    }
}