import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string | null;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.todo })
  status!: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.low })
  priority!: TaskPriority;

  @ApiProperty()
  dueDate!: Date | null;

  @ApiProperty()
  creatorId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
