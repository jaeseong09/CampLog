package com.camplog.controller;

import com.camplog.dto.RankingResponse;
import com.camplog.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    // 주간 랭킹 (이번 주)
    @GetMapping("/weekly")
    public ResponseEntity<List<RankingResponse>> weekly() {
        return ResponseEntity.ok(rankingService.getWeeklyRanking());
    }

    // 월간 랭킹 (이번 달)
    @GetMapping("/monthly")
    public ResponseEntity<List<RankingResponse>> monthly() {
        return ResponseEntity.ok(rankingService.getMonthlyRanking());
    }

    // 지난 주 랭킹
    @GetMapping("/last-week")
    public ResponseEntity<List<RankingResponse>> lastWeek() {
        return ResponseEntity.ok(rankingService.getLastWeekRanking());
    }

    // 전체 누적 랭킹
    @GetMapping("/all-time")
    public ResponseEntity<List<RankingResponse>> allTime() {
        return ResponseEntity.ok(rankingService.getAllTimeRanking());
    }
}