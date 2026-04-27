package com.camplog.service;

import com.camplog.dto.SquadMemberStatus;
import com.camplog.dto.SquadResponse;
import com.camplog.entity.Squad;
import com.camplog.entity.SquadMember;
import com.camplog.entity.StudySession;
import com.camplog.entity.User;
import com.camplog.repository.SquadMemberRepository;
import com.camplog.repository.SquadRepository;
import com.camplog.repository.StudySessionRepository;
import com.camplog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SquadService {

    private final SquadRepository squadRepository;
    private final SquadMemberRepository squadMemberRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

    private static final String CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    // 스쿼드 생성
    @Transactional
    public SquadResponse createSquad(String email) {
        User user = getUser(email);
        checkNotInActiveSquad(user);

        String inviteCode = generateUniqueCode();
        Squad squad = Squad.builder()
                .inviteCode(inviteCode)
                .host(user)
                .build();
        squadRepository.save(squad);

        SquadMember member = SquadMember.builder()
                .squad(squad)
                .user(user)
                .build();
        squadMemberRepository.save(member);

        return buildSquadResponse(squad);
    }

    // 스쿼드 참여
    @Transactional
    public SquadResponse joinSquad(String inviteCode, String email) {
        User user = getUser(email);
        checkNotInActiveSquad(user);

        Squad squad = squadRepository.findByInviteCode(inviteCode.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 초대 코드입니다."));

        if (squad.getStatus() != Squad.SquadStatus.ACTIVE) {
            throw new IllegalStateException("이미 해산된 스쿼드입니다.");
        }

        if (squadMemberRepository.existsBySquadAndUser(squad, user)) {
            throw new IllegalStateException("이미 참여 중인 스쿼드입니다.");
        }

        SquadMember member = SquadMember.builder()
                .squad(squad)
                .user(user)
                .build();
        squadMemberRepository.save(member);

        return buildSquadResponse(squad);
    }

    // 현재 참여 중인 스쿼드 조회
    @Transactional(readOnly = true)
    public SquadResponse getCurrentSquad(String email) {
        User user = getUser(email);
        SquadMember membership = squadMemberRepository
                .findFirstByUserAndSquad_Status(user, Squad.SquadStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("참여 중인 스쿼드가 없습니다."));
        return buildSquadResponse(membership.getSquad());
    }

    // 스쿼드 조회 (id)
    @Transactional(readOnly = true)
    public SquadResponse getSquad(Long squadId) {
        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() -> new IllegalArgumentException("스쿼드를 찾을 수 없습니다."));
        return buildSquadResponse(squad);
    }

    // 스쿼드 탈퇴
    @Transactional
    public void leaveSquad(Long squadId, String email) {
        User user = getUser(email);
        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() -> new IllegalArgumentException("스쿼드를 찾을 수 없습니다."));

        SquadMember member = squadMemberRepository.findBySquadAndUser(squad, user)
                .orElseThrow(() -> new IllegalStateException("해당 스쿼드에 참여 중이 아닙니다."));

        squadMemberRepository.delete(member);

        List<SquadMember> remaining = squadMemberRepository.findBySquad(squad);
        if (remaining.isEmpty()) {
            // 마지막 멤버가 나가면 스쿼드 해산
            squad.setStatus(Squad.SquadStatus.DISBANDED);
            squadRepository.save(squad);
        } else if (squad.getHost().getId().equals(user.getId())) {
            // 방장이 나가면 다음 멤버에게 방장 이전
            squad.setHost(remaining.get(0).getUser());
            squadRepository.save(squad);
        }
    }

    // 스쿼드 강제 해산 (방장만 가능)
    @Transactional
    public void disbandSquad(Long squadId, String email) {
        User user = getUser(email);
        Squad squad = squadRepository.findById(squadId)
                .orElseThrow(() -> new IllegalArgumentException("스쿼드를 찾을 수 없습니다."));

        if (!squad.getHost().getId().equals(user.getId())) {
            throw new IllegalStateException("방장만 스쿼드를 해산할 수 있습니다.");
        }

        squad.setStatus(Squad.SquadStatus.DISBANDED);
        squadRepository.save(squad);
        squadMemberRepository.deleteAll(squadMemberRepository.findBySquad(squad));
    }

    // --- private helpers ---

    private SquadResponse buildSquadResponse(Squad squad) {
        List<SquadMember> members = squadMemberRepository.findBySquad(squad);
        List<User> users = members.stream().map(SquadMember::getUser).toList();

        // 멤버 전원의 활성 세션을 한 번에 조회 (N+1 방지)
        Map<Long, StudySession> activeSessionByUserId = studySessionRepository
                .findByUserInAndEndedAtIsNull(users)
                .stream()
                .collect(Collectors.toMap(s -> s.getUser().getId(), s -> s));

        List<SquadMemberStatus> statuses = members.stream()
                .map(m -> {
                    StudySession active = activeSessionByUserId.get(m.getUser().getId());
                    return SquadMemberStatus.builder()
                            .userId(m.getUser().getId())
                            .nickname(m.getUser().getNickname())
                            .avatarType(m.getUser().getAvatarType())
                            .totalStudyTime(m.getUser().getTotalStudyTime())
                            .isStudying(active != null)
                            .activeSessionId(active != null ? active.getId() : null)
                            .build();
                })
                .toList();
        return SquadResponse.of(squad, statuses);
    }

    private void checkNotInActiveSquad(User user) {
        squadMemberRepository.findFirstByUserAndSquad_Status(user, Squad.SquadStatus.ACTIVE)
                .ifPresent(m -> { throw new IllegalStateException("이미 참여 중인 스쿼드가 있습니다."); });
    }

    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_CHARS.charAt(SECURE_RANDOM.nextInt(CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (squadRepository.findByInviteCode(code).isPresent());
        return code;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));
    }
}