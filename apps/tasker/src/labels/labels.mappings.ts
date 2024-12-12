import { Label } from '@prisma/client';
import { LabelDto } from '@tasker/shared';

export function mapLabelToDto(label: Label): LabelDto {
  if (!label) return null;
  return {
    id: label.id,
    name: label.name,
  };
}
