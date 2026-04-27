package com.camplog.repository;

import com.camplog.entity.StudySession;
import com.camplog.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    List<StudySession> findByUserAndStartedAtBetweenOrderByStartedAtDesc(
            User user, LocalDateTime start, LocalDateTime end);

    Optional<StudySession> findFirstByUserAndEndedAtIsNull(User user);

    Optional<StudySession> findByIdAndUser(Long id, User user);

    // 여러 유저의 활성 세션을 한 번에 조회 (Squad N+1 방지)
    List<StudySession> findByUserInAndEndedAtIsNull(java.util.Collection<User> users);

    // 기간별 랭킹: 해당 기간에 공부한 유저들을 합산 시간 기준으로 정렬
    @Query("SELECT s.user, SUM(s.duration) as total " +
           "FROM StudySession s " +
           "WHERE s.startedAt >= :start AND s.startedAt < :end AND s.endedAt IS NOT NULL " +
           "GROUP BY s.user " +
           "ORDER BY total DESC")
    List<Object[]> findRankingByPeriod(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable);
}