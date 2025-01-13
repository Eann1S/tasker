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
  ApiResponse,
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
  async getTeam(
    @Param('teamId') teamId: string
  ) {
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
  async addUserToTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.addUserToTeam(teamId, userId);
  }

  @Delete(':teamId/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The user has been successfully removed from the team.',
  })
  async removeUserFromTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
    return this.teamsService.removeUserFromTeam(teamId, userId);
  }

  @Post(':teamId/task/:taskId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The task has been successfully assigned to the team.',
    type: TeamDto,
  })
  async assignTaskToTeam(@Param('teamId') teamId: string, @Param('taskId') taskId: string) {
    return this.teamsService.assignTaskToTeam(teamId, taskId);
  }

  @Delete(':teamId/task/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The task has been successfully removed from the team.',
  })
  async removeTaskFromTeam(@Param('teamId') teamId: string, @Param('taskId') taskId: string) {
    return this.teamsService.removeTaskFromTeam(teamId, taskId);
  }
}
