package com.camplog.service;

import com.camplog.dto.SessionEndRequest;
import com.camplog.dto.SessionEndResponse;
import com.camplog.dto.SessionResponse;
import com.camplog.dto.SessionStartResponse;
import com.camplog.entity.StudySession;
import com.camplog.entity.User;
import com.camplog.repository.StudySessionRepository;
import com.camplog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;
    private final CampsiteService campsiteService;

    // 세션 시작
    @Transactional
    public SessionStartResponse startSession(String email) {
        User user = getUser(email);

        // 이미 진행 중인 세션이 있으면 폐기(duration=0)하고 새로 시작
        studySessionRepository.findFirstByUserAndEndedAtIsNull(user).ifPresent(s -> {
            s.setEndedAt(s.getStartedAt());
            s.setDuration(0);
            s.setFocusScore(0);
            s.setPauseCount(0);
            studySessionRepository.save(s);
        });

        StudySession session = StudySession.builder()
                .user(user)
                .startedAt(LocalDateTime.now())
                .pauseCount(0)
                .build();

        studySessionRepository.save(session);
        return new SessionStartResponse(session.getId(), session.getStartedAt());
    }

    // 세션 종료
    @Transactional
    public SessionEndResponse endSession(Long sessionId, String email, SessionEndRequest request) {
        User user = getUser(email);

        StudySession session = studySessionRepository.findByIdAndUser(sessionId, user)
                .orElseThrow(() -> new IllegalArgumentException("세션을 찾을 수 없습니다."));

        if (session.getEndedAt() != null) {
            throw new IllegalStateException("이미 종료된 세션입니다.");
        }

        LocalDateTime endedAt = LocalDateTime.now();
        // 1분 미만은 1분으로 올림 (30초 세션도 기록되도록)
        long seconds = Duration.between(session.getStartedAt(), endedAt).toSeconds();
        int duration = (int) Math.max(1, (long) Math.ceil(seconds / 60.0));

        session.setEndedAt(endedAt);
        session.setDuration(duration);
        session.setFocusScore(request.getFocusScore());
        session.setPauseCount(request.getPauseCount());

        // 유저 누적 공부 시간 업데이트 및 캠프 아이템 해금 체크
        long prevTotal = user.getTotalStudyTime();
        long newTotal = prevTotal + duration;
        user.setTotalStudyTime(newTotal);
        userRepository.save(user);

        List<String> newItems = campsiteService.checkAndUnlock(user, prevTotal, newTotal);

        return SessionEndResponse.builder()
                .id(session.getId())
                .startedAt(session.getStartedAt())
                .endedAt(endedAt)
                .duration(duration)
                .focusScore(request.getFocusScore())
                .pauseCount(request.getPauseCount())
                .newlyUnlockedItems(newItems)
                .build();
    }

    // 현재 진행 중인 세션 조회
    @Transactional(readOnly = true)
    public Optional<SessionStartResponse> getActiveSession(String email) {
        User user = getUser(email);
        return studySessionRepository.findFirstByUserAndEndedAtIsNull(user)
                .map(s -> new SessionStartResponse(s.getId(), s.getStartedAt()));
    }

    // 오늘 세션 목록
    @Transactional(readOnly = true)
    public List<SessionResponse> getTodaySessions(String email) {
        User user = getUser(email);
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return studySessionRepository
                .findByUserAndStartedAtBetweenOrderByStartedAtDesc(user, startOfDay, endOfDay)
                .stream()
                .map(SessionResponse::from)
                .toList();
    }

    // 주간 세션 목록 (최근 7일)
    @Transactional(readOnly = true)
    public List<SessionResponse> getWeeklySessions(String email) {
        User user = getUser(email);
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();
        return studySessionRepository
                .findByUserAndStartedAtBetweenOrderByStartedAtDesc(user, start, end)
                .stream()
                .map(SessionResponse::from)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));
    }
}