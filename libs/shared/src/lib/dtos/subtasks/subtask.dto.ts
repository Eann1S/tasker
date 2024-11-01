import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class SubtaskDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  taskId!: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.todo })
  status?: TaskStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
