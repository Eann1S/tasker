import { PartialType } from '@nestjs/swagger';
import { CreateSubtaskDto } from './createSubtask.dto';

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {}
