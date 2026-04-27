package com.camplog.controller;

import com.camplog.dto.JoinSquadRequest;
import com.camplog.dto.SquadResponse;
import com.camplog.service.SquadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/squads")
@RequiredArgsConstructor
public class SquadController {

    private final SquadService squadService;

    // 스쿼드 생성 → 초대 코드 발급
    @PostMapping
    public ResponseEntity<SquadResponse> create(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(squadService.createSquad(userDetails.getUsername()));
    }

    // 초대 코드로 참여
    @PostMapping("/join")
    public ResponseEntity<SquadResponse> join(
            @Valid @RequestBody JoinSquadRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(squadService.joinSquad(request.getInviteCode(), userDetails.getUsername()));
    }

    // 현재 참여 중인 스쿼드 조회 (멤버 공부 현황 포함)
    @GetMapping("/current")
    public ResponseEntity<SquadResponse> current(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(squadService.getCurrentSquad(userDetails.getUsername()));
    }

    // 특정 스쿼드 조회
    @GetMapping("/{id}")
    public ResponseEntity<SquadResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(squadService.getSquad(id));
    }

    // 스쿼드 탈퇴
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<String> leave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        squadService.leaveSquad(id, userDetails.getUsername());
        return ResponseEntity.ok("스쿼드 탈퇴 완료");
    }

    // 스쿼드 해산 (방장 전용)
    @DeleteMapping("/{id}/disband")
    public ResponseEntity<String> disband(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        squadService.disbandSquad(id, userDetails.getUsername());
        return ResponseEntity.ok("스쿼드 해산 완료");
    }
}