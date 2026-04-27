package com.camplog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "campsite_items")
public class CampsiteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 유저의 아이템인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 아이템 종류 (예: "tent", "lantern", "chair", "squirrel", "pigeon_nest", "constellation")
    @Column(nullable = false)
    private String itemType;

    // 해금된 시간
    @Column(nullable = false)
    private LocalDateTime unlockedAt;
}