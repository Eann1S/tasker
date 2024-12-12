import { Task, Team, TeamMember } from '@prisma/client';
import { TeamDto, TeamMemberDto } from '@tasker/shared';
import { mapTaskToDto } from '../tasks/tasks.mappings';

export function mapTeamToDto(team: Team & { members?: TeamMember[], tasks?: Task[] }): TeamDto {
  return {
    id: team.id,
    name: team.name,
    members: team.members?.map(mapTeamMemberToDto),
    tasks: team.tasks?.map(mapTaskToDto),
  }
}

export function mapTeamMemberToDto(teamMember: TeamMember): TeamMemberDto {
  return {
    userId: teamMember.userId,
    teamId: teamMember.teamId,
    role: teamMember.role,
    joinedAt: teamMember.joinedAt,
  };
}
