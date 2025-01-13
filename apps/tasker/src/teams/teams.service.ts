import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto, PrismaService, TeamDto } from '@tasker/shared';
import { mapTeamToDto } from './team.mappings';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  private readonly include = { members: true, tasks: true };

  async createTeam(userId: string, dto: CreateTeamDto) {
    try {
      Logger.debug(`Creating team with name ${dto.name}`);

      const team = await this.prisma.team.create({
        data: {
          ...dto,
          members: {
            create: { userId, role: 'admin' },
          },
        },
        include: this.include,
      });

      Logger.debug(`Created team with id ${team.id}`);
      return mapTeamToDto(team);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to create team');
    }
  }
  
  async getTeamById(teamId: string): Promise<TeamDto> {
    try {
      Logger.debug(`Retrieving team with id ${teamId}`);

      const team = await this.prisma.team.findUniqueOrThrow({
        where: { id: teamId },
        include: this.include,
      });
      return mapTeamToDto(team);
    } catch (e) {
      Logger.error(e);
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
  }
  
  async getTeams(): Promise<TeamDto[]> {
    try {
      Logger.debug(`Retrieving teams`);

      const teams = await this.prisma.team.findMany({
        include: this.include,
      });
      return teams.map(mapTeamToDto);
    } catch (e) {
      Logger.error(e);
      throw new NotFoundException(`Failed to retrieve teams`);
    }
  }

  async addUserToTeam(teamId: string, userId: string) {
    try {
      Logger.debug(`Adding user ${userId} to team ${teamId}`);

      const team = await this.prisma.team.update({
        where: { id: teamId },
        data: {
          members: {
            create: { userId, role: 'member' },
          },
        },
        include: this.include,
      });

      Logger.debug(`Added user ${userId} to team ${teamId}`);
      return mapTeamToDto(team);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to add user to team');
    }
  }

  async removeUserFromTeam(teamId: string, userId: string) {
    try {
      Logger.debug(`Deleting user ${userId} from team ${teamId}`);

      await this.prisma.teamMember.delete({
        where: {
          teamId_userId: { teamId, userId },
        },
      });

      Logger.debug(`Deleted user ${userId} from team ${teamId}`);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to delete team');
    }
  }

  async assignTaskToTeam(teamId: string, taskId: string) {
    try {
      Logger.debug(`Assigning task ${taskId} to team ${teamId}`);

      const team = await this.prisma.team.update({
        where: { id: teamId },
        data: {
          tasks: {
            connect: { id: taskId },
          },
        },
        include: this.include,
      });

      Logger.debug(`Assigned task ${taskId} to team {teamId}`);
      return mapTeamToDto(team);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to assign task to team');
    }
  }

  async removeTaskFromTeam(teamId: string, taskId: string) {
    try {
      Logger.debug(`Removing task ${taskId} from team ${teamId}`);

      const team = await this.prisma.team.update({
        where: { id: teamId },
        data: {
          tasks: {
            disconnect: { id: taskId },
          },
        },
        include: this.include,
      });

      Logger.debug(`Removed task ${taskId} from team ${teamId}`);
      return mapTeamToDto(team);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to assign task to team');
    }
  }
}
