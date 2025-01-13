import { Task, Team, TeamMember } from '@prisma/client';
import { TeamDto } from '@tasker/shared';
import { mapTaskToDto } from '../tasks/tasks.mappings';
import { mapTeamMemberToDto } from './team-member.mappings';

export function mapTeamToDto(team: Team & { members?: TeamMember[], tasks?: Task[] }): TeamDto {
  return {
    id: team.id,
    name: team.name,
    members: team.members?.map(mapTeamMemberToDto),
    tasks: team.tasks?.map(mapTaskToDto),
  }
}
