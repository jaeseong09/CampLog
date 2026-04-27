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
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    // 캐릭터/아바타 타입 (예: "tent", "cabin", "rv" 등)
    private String avatarType;

    // 총 공부 시간 (분 단위, 세션이 끝날 때마다 누적)
    @Builder.Default
    private Long totalStudyTime = 0L;

    // Refresh 토큰 (로그인 시 저장, 로그아웃 시 null)
    @Column(length = 512)
    private String refreshToken;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}