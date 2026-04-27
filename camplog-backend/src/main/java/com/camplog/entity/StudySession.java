package com.camplog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "study_sessions")
@EntityListeners(AuditingEntityListener.class)
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 유저의 세션인지 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 공부 시작 시간
    private LocalDateTime startedAt;

    // 공부 종료 시간 (세션 종료 전에는 null)
    private LocalDateTime endedAt;

    // 공부 시간 (분 단위, 세션 종료 시 계산)
    private Integer duration;

    // 집중도 점수 (0~100, 프론트에서 계산해서 전달)
    private Integer focusScore;

    // 중간에 일시정지한 횟수
    private Integer pauseCount;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}