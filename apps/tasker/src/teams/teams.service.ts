import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto, PrismaService, TeamDto } from '@tasker/shared';
import { mapTeamToDto } from './team.mappings';
import { TeamRole } from '@prisma/client';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService, private tasksService: TasksService) {}

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

  async addUserToTeam(curUserId: string, teamId: string, userId: string) {
    await this.checkThatUserIsAdmin(curUserId, teamId);
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

  async removeUserFromTeam(curUserId: string, teamId: string, userId: string) {
    if (curUserId !== userId) {
      await this.checkThatUserIsAdmin(curUserId, teamId);
    }
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

  async assignTaskToMember(
    curUserId: string,
    teamId: string,
    taskId: string,
    memberId: string
  ) {
    await this.checkThatUserIsAdmin(curUserId, teamId);
    await this.checkThatUserIsMember(memberId, teamId);
    await this.checkThatTaskBelongsToTeam(teamId, taskId);
    try {
      Logger.debug(`Assigning task ${taskId} to member ${memberId}`);

      await this.tasksService.assignTask(taskId, memberId);

      Logger.debug(`Assigned task ${taskId} to member ${memberId}`);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to assign task');
    }
  }

  async removeTaskFromMember(
    curUserId: string,
    teamId: string,
    taskId: string,
    memberId: string
  ) {
    await this.checkThatUserIsAdmin(curUserId, teamId);
    await this.checkThatUserIsMember(memberId, teamId);
    await this.checkThatTaskBelongsToTeam(teamId, taskId);
    try {
      Logger.debug(`Removing task ${taskId} from member ${memberId}`);

      await this.tasksService.removeTaskFromAssignee(taskId, memberId);

      Logger.debug(`Removed task ${taskId} from member ${memberId}`);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to remove task');
    }
  }

  async getTasksForMember(teamId: string, memberId: string) {
    try {
      Logger.debug(`Getting tasks for member ${memberId} in team ${teamId}`);
      const tasks = await this.tasksService.getTasksForAssignee(memberId, teamId);
      return tasks;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to get tasks for member');
    }
  }

  async getTasksForTeam(curUserId: string, teamId: string) {
    await this.checkThatUserIsMember(curUserId, teamId);
    try {
      Logger.debug(`Getting tasks for team ${teamId}`);
      const tasks = await this.tasksService.getTasksForTeam(teamId);
      return tasks;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException('Failed to get tasks for team');
    }
  }

  private async checkThatUserIsAdmin(userId: string, teamId: string) {
    const member = await this.getTeamMember(userId, teamId);
    if (member.role !== TeamRole.admin) {
      throw new ForbiddenException(
        `User with id ${userId} is not an admin of team with id ${teamId}`
      );
    }
  }

  private async checkThatUserIsMember(userId: string, teamId: string) {
    await this.getTeamMember(userId, teamId);
  }

  private async checkThatTaskBelongsToTeam(teamId: string, taskId: string) {
    const task = await this.tasksService.getTask(taskId);
    if (task.teamId !== teamId) {
      throw new BadRequestException(
        `Task with id ${taskId} does not belong to team with id ${teamId}`
      );
    }
  }

  private async getTeamMember(userId: string, teamId: string) {
    try {
      return await this.prisma.teamMember.findUniqueOrThrow({
        where: {
          teamId_userId: {
            userId,
            teamId,
          },
        },
      });
    } catch (e) {
      Logger.error(e);
      throw new NotFoundException(
        `Team member with userId ${userId} and teamId ${teamId} not found`
      );
    }
  }
}
