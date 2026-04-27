package com.camplog.repository;

import com.camplog.entity.Squad;
import com.camplog.entity.SquadMember;
import com.camplog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SquadMemberRepository extends JpaRepository<SquadMember, Long> {

    List<SquadMember> findBySquad(Squad squad);

    Optional<SquadMember> findBySquadAndUser(Squad squad, User user);

    // 유저가 현재 참여 중인 ACTIVE 스쿼드 멤버십 조회
    Optional<SquadMember> findFirstByUserAndSquad_Status(User user, Squad.SquadStatus status);

    boolean existsBySquadAndUser(Squad squad, User user);
}