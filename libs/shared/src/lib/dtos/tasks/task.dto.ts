import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string | null;

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
  @ApiProperty()
  dueDate!: Date | null;

  @ApiProperty()
  creatorId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
