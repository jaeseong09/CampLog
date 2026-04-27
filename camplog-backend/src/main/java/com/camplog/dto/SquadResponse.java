package com.camplog.dto;

import com.camplog.entity.Squad;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SquadResponse {
    private Long id;
    private String inviteCode;
    private String hostNickname;
    private String status;
    private List<SquadMemberStatus> members;

    public static SquadResponse of(Squad squad, List<SquadMemberStatus> members) {
        return SquadResponse.builder()
                .id(squad.getId())
                .inviteCode(squad.getInviteCode())
                .hostNickname(squad.getHost().getNickname())
                .status(squad.getStatus().name())
                .members(members)
                .build();
    }
}