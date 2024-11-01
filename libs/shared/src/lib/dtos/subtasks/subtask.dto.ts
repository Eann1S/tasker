import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SubtaskDto {
  @ApiProperty()
  id!: string;

  @IsNotEmpty()
  @ApiProperty()
  title!: string;

  @ApiProperty()
  taskId!: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.todo })
  status!: TaskStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
