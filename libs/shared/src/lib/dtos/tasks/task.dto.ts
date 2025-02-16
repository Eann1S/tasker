import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SubtaskDto } from '../subtasks/subtask.dto';
import { LabelDto } from '../labels/label.dto';
import { UserDto } from '../users/user.dto';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: UserDto })
  creator!: UserDto;

  @ApiProperty({ type: UserDto })
  assignee!: UserDto;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.todo })
  status!: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiProperty({ enum: TaskPriority, default: TaskPriority.low })
  priority!: TaskPriority;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  dueDate?: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ isArray: true, default: [] })
  subtasks?: SubtaskDto[];

  @ApiProperty({ isArray: true, default: [] })
  labels?: LabelDto[];

  @ApiProperty()
  teamId?: string;
}
