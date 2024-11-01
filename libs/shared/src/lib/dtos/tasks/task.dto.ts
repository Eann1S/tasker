import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SubtaskDto } from '../subtasks/subtask.dto';
import { LabelDto } from '../labels/label.dto';
import { UserDto } from '../user.dto';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @IsOptional()
  @ApiProperty()
  description!: string | null;

  @ApiProperty({ type: UserDto })
  creator!: UserDto;

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
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ isArray: true, default: [] })
  subtasks!: SubtaskDto[];

  @ApiProperty({ isArray: true, default: [] })
  labels!: LabelDto[];
}
