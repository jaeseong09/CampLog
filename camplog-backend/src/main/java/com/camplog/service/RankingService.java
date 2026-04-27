package com.camplog.service;

import com.camplog.dto.RankingResponse;
import com.camplog.entity.User;
import com.camplog.repository.StudySessionRepository;
import com.camplog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    private static final int TOP_N = 100;

    // 주간 랭킹 (이번 주 월요일 00:00 ~ 지금)
    @Transactional(readOnly = true)
    public List<RankingResponse> getWeeklyRanking() {
        LocalDateTime startOfWeek = LocalDateTime.now()
                .with(java.time.DayOfWeek.MONDAY)
                .toLocalDate().atStartOfDay();
        return buildRanking(startOfWeek, LocalDateTime.now());
    }

    // 월간 랭킹 (이번 달 1일 00:00 ~ 지금)
    @Transactional(readOnly = true)
    public List<RankingResponse> getMonthlyRanking() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .toLocalDate().atStartOfDay();
        return buildRanking(startOfMonth, LocalDateTime.now());
    }

    // 지난 주 랭킹 (지난 주 월요일 ~ 일요일)
    @Transactional(readOnly = true)
    public List<RankingResponse> getLastWeekRanking() {
        LocalDateTime startOfLastWeek = LocalDateTime.now()
                .minusWeeks(1)
                .with(java.time.DayOfWeek.MONDAY)
                .toLocalDate().atStartOfDay();
        LocalDateTime endOfLastWeek = startOfLastWeek.plusDays(7);
        return buildRanking(startOfLastWeek, endOfLastWeek);
    }

    // 누적 전체 랭킹 (totalStudyTime 기준)
    @Transactional(readOnly = true)
    public List<RankingResponse> getAllTimeRanking() {
        List<User> users = userRepository.findTop100ByOrderByTotalStudyTimeDesc();
        int[] rank = {1};
        return users.stream()
                .map(u -> RankingResponse.of(rank[0]++, u, u.getTotalStudyTime()))
                .toList();
    }

    private List<RankingResponse> buildRanking(LocalDateTime start, LocalDateTime end) {
        List<Object[]> rows = studySessionRepository.findRankingByPeriod(
                start, end, PageRequest.of(0, TOP_N));
        int[] rank = {1};
        return rows.stream()
                .map(row -> RankingResponse.of(rank[0]++, (User) row[0], (Long) row[1]))
                .toList();
    }
}