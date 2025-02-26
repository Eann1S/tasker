import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, TeamDto } from '@tasker/shared';
import {
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The team has been successfully created.',
    type: TeamDto,
  })
  async createTeam(
    @Req() request: { userId: string },
    @Body() data: CreateTeamDto
  ) {
    return this.teamsService.createTeam(request.userId, data);
  }

  @Get(':teamId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The team has been successfully retrieved.',
    type: TeamDto,
  })
  async getTeam(@Param('teamId') teamId: string) {
    return this.teamsService.getTeamById(teamId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The teams have been successfully retrieved.',
    type: [TeamDto],
  })
  async getTeams() {
    return this.teamsService.getTeams();
  }

  @Post(':teamId/user/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The user has been successfully added to the team.',
    type: TeamDto,
  })
  async addUserToTeam(
    @Req() req: { userId: string },
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.addUserToTeam(req.userId, teamId, userId);
  }

  @Delete(':teamId/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The user has been successfully removed from the team.',
  })
  async removeUserFromTeam(
    @Req() req: { userId: string },
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.removeUserFromTeam(req.userId, teamId, userId);
  }

  @Post(':teamId/member/:memberId/task/:taskId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The task has been successfully assigned to the member.',
    type: TeamDto,
  })
  async assignTaskToMember(
    @Req() req: { userId: string },
    @Param('teamId') teamId: string,
    @Param('taskId') taskId: string,
    @Param('memberId') memberId: string
  ) {
    return this.teamsService.assignTaskToMember(req.userId, teamId, taskId, memberId);
  }

  @Delete(':teamId/member/:memberId/task/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The task has been successfully removed from the member.',
    type: TeamDto,
  })
  async removeTaskFromMember(
    @Req() req: { userId: string },
    @Param('teamId') teamId: string,
    @Param('taskId') taskId: string,
    @Param('memberId') memberId: string
  ) {
    return this.teamsService.removeTaskFromMember(req.userId, teamId, taskId, memberId);
  }

  @Get(':teamId/member/:memberId/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Tasks have been successfully retrieved for the member.',
    type: TeamDto,
  })
  async getTasksForMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string
  ) {
    return this.teamsService.getTasksForMember(teamId, memberId);
  }

  @Get(':teamId/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Tasks have been successfully retrieved for the team.',
    type: TeamDto,
  })
  async getTasksForTeam(
    @Req() req: { userId: string },
    @Param('teamId') teamId: string,
  ) {
    return this.teamsService.getTasksForTeam(req.userId, teamId);
  }
}
