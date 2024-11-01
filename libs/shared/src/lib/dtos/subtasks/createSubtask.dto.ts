import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { SubtaskDto } from './subtask.dto';

export class CreateSubtaskDto extends IntersectionType(
  PickType(SubtaskDto, ['title'] as const),
  PartialType(PickType(SubtaskDto, ['status'] as const))
) {}
