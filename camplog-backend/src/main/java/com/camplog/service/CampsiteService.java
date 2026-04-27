package com.camplog.service;

import com.camplog.dto.CampsiteItemResponse;
import com.camplog.dto.CampsiteResponse;
import com.camplog.entity.CampsiteItem;
import com.camplog.entity.User;
import com.camplog.repository.CampsiteItemRepository;
import com.camplog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampsiteService {

    private final CampsiteItemRepository campsiteItemRepository;
    private final UserRepository userRepository;

    // 누적 공부 시간 기준 아이템 해금 기준표
    // key: 필요 분수, value: 해금되는 아이템 목록
    private static final Map<Long, List<String>> UNLOCK_MAP = new LinkedHashMap<>() {{
        put(90L,  List.of("bear"));
        put(120L, List.of("tent"));
        put(240L, List.of("lantern", "chair"));
        put(360L, List.of("squirrel"));
        put(540L, List.of("pigeon_nest"));
        put(960L, List.of("constellation"));
    }};

    // 세션 종료 시 호출 - 구간을 넘은 threshold의 아이템 해금
    @Transactional
    public List<String> checkAndUnlock(User user, long prevMinutes, long newMinutes) {
        List<String> newItems = new ArrayList<>();

        for (Map.Entry<Long, List<String>> entry : UNLOCK_MAP.entrySet()) {
            long threshold = entry.getKey();
            // 이전엔 못 넘었고 이번에 넘은 경우만 처리
            if (prevMinutes < threshold && newMinutes >= threshold) {
                for (String itemType : entry.getValue()) {
                    // 중복 해금 방지 (동시 요청 등 예외 상황 대비)
                    if (!campsiteItemRepository.existsByUserAndItemType(user, itemType)) {
                        CampsiteItem item = CampsiteItem.builder()
                                .user(user)
                                .itemType(itemType)
                                .unlockedAt(LocalDateTime.now())
                                .build();
                        campsiteItemRepository.save(item);
                        newItems.add(itemType);
                    }
                }
            }
        }

        return newItems;
    }

    // 캠프사이트 현황 조회 (소급 해금 포함)
    @Transactional
    public CampsiteResponse getCampsite(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));

        // 이미 조건을 충족했지만 해금되지 않은 아이템 소급 처리
        for (Map.Entry<Long, List<String>> entry : UNLOCK_MAP.entrySet()) {
            if (user.getTotalStudyTime() >= entry.getKey()) {
                for (String itemType : entry.getValue()) {
                    if (!campsiteItemRepository.existsByUserAndItemType(user, itemType)) {
                        campsiteItemRepository.save(CampsiteItem.builder()
                                .user(user)
                                .itemType(itemType)
                                .unlockedAt(LocalDateTime.now())
                                .build());
                    }
                }
            }
        }

        List<CampsiteItemResponse> items = campsiteItemRepository
                .findByUserOrderByUnlockedAtAsc(user)
                .stream()
                .map(CampsiteItemResponse::from)
                .toList();

        // 다음 해금까지 남은 시간 계산
        Long nextUnlock = UNLOCK_MAP.keySet().stream()
                .filter(threshold -> user.getTotalStudyTime() < threshold)
                .findFirst()
                .map(threshold -> threshold - user.getTotalStudyTime())
                .orElse(null); // null = 모든 아이템 해금 완료

        return CampsiteResponse.builder()
                .totalStudyTime(user.getTotalStudyTime())
                .nextUnlockMinutes(nextUnlock)
                .unlockedItems(items)
                .build();
    }
}