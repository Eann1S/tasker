import { TeamMember } from '@prisma/client';
import { TeamMemberDto } from '@tasker/shared';


export function mapTeamMemberToDto(teamMember: TeamMember): TeamMemberDto {
  return {
    userId: teamMember.userId,
    teamId: teamMember.teamId,
    role: teamMember.role,
    joinedAt: teamMember.joinedAt,
  };
}
