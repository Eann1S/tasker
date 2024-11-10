import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateLabelDto,
  CreateTaskDto,
  TaskDto,
  UpdateTaskDto,
} from '@tasker/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: TaskDto,
  })
  async createTask(
    @Request() req: { userId: string },
    @Body() data: CreateTaskDto
  ): Promise<TaskDto> {
    return this.tasksService.createTask(req.userId, data);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The tasks for user have been successfully retrieved.',
    type: [TaskDto],
  })
  async getTasksForUser(@Param('userId') userId: string): Promise<TaskDto[]> {
    return this.tasksService.getTasksForUser(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The task has been successfully retrieved.',
    type: TaskDto,
  })
  async getTask(@Param('id') id: string): Promise<TaskDto> {
    return this.tasksService.getTask(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The task has been successfully updated.',
    type: TaskDto,
  })
  async updateTask(
    @Param('id') id: string,
    @Body() data: UpdateTaskDto
  ): Promise<TaskDto> {
    return this.tasksService.updateTask(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The task has been successfully deleted.',
  })
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  @Post(':id/labels')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'The labels have been successfully created for the task.',
    type: TaskDto,
  })
  async createLabelsForTask(
    @Param('id') id: string,
    @Body() labels: CreateLabelDto[]
  ): Promise<TaskDto> {
    return this.tasksService.createLabelsForTask(id, labels);
  }

  @Put(':id/labels')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The labels have been successfully assigned to the task.',
    type: TaskDto,
  })
  async assignLabelsToTask(
    @Param('id') id: string,
    @Body() labelIds: string[]
  ): Promise<TaskDto> {
    return this.tasksService.assignLabelsToTask(id, labelIds);
  }

  @Delete(':id/labels')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The labels have been successfully removed from the task.',
    type: TaskDto,
  })
  async removeLabelsFromTask(
    @Param('id') id: string,
    @Body() labelIds: string[]
  ): Promise<TaskDto> {
    return this.tasksService.removeLabelsFromTask(id, labelIds);
  }
}
