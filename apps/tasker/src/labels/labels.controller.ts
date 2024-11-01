import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LabelDto, CreateLabelDto } from '@tasker/shared';

@ApiBearerAuth()
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The label has been successfully created.',
    type: LabelDto,
  })
  async createLabel(@Body() label: CreateLabelDto): Promise<LabelDto> {
    return this.labelsService.createLabel(label);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The labels have been successfully retrieved.',
    type: [LabelDto],
  })
  async getLabels(): Promise<LabelDto[]> {
    return this.labelsService.getLabels();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The label has been successfully deleted.',
  })
  async deleteLabel(@Param('id') id: string): Promise<void> {
    await this.labelsService.deleteLabel(id);
  }
}
