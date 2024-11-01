import { OmitType } from '@nestjs/swagger';
import { SubtaskDto } from './subtask.dto';

export class CreateSubtaskDto extends OmitType(SubtaskDto, [
  'id',
  'taskId',
  'createdAt',
  'updatedAt',
] as const) {}
