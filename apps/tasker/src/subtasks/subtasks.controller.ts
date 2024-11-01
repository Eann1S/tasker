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
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto, SubtaskDto, UpdateSubtaskDto } from '@tasker/shared';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post(':taskId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The subtask has been successfully created.',
    type: SubtaskDto,
  })
  async createSubtask(
    @Param('taskId') taskId: string,
    @Body() subtask: CreateSubtaskDto
  ): Promise<SubtaskDto> {
    return this.subtasksService.createSubtask(taskId, subtask);
  }

  @Get('/task/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The subtasks for task have been successfully retrieved.',
    type: [SubtaskDto],
  })
  async getSubtasksForTask(
    @Param('taskId') taskId: string
  ): Promise<SubtaskDto[]> {
    return this.subtasksService.getSubtasksForTask(taskId);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The subtask has been successfully updated.',
    type: SubtaskDto,
  })
  async updateSubtask(
    @Param('id') id: string,
    @Body() subtask: UpdateSubtaskDto
  ): Promise<SubtaskDto> {
    return this.subtasksService.updateSubtask(id, subtask);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The subtask has been successfully deleted.',
  })
  async deleteSubtask(@Param('id') id: string): Promise<void> {
    await this.subtasksService.deleteSubtask(id);
  }
}
