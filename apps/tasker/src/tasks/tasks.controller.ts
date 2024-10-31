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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from '@tasker/shared';
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
  async createTask(@Body() data: CreateTaskDto): Promise<TaskDto> {
    return this.tasksService.createTask(data);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The tasks for user have been successfully retrieved.',
    type: [TaskDto],
  })
  async findAllForUser(@Param('userId') userId: string): Promise<TaskDto[]> {
    return this.tasksService.findAllForUser(userId);
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
}
