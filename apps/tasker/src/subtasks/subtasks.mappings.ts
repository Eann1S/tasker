import { Subtask } from '@prisma/client';
import { SubtaskDto } from '@tasker/shared';

export function mapSubtaskToDto(
  subtask: Subtask & { taskId: string }
): SubtaskDto {
  if(!subtask) return null;
  return {
    id: subtask.id,
    title: subtask.title,
    status: subtask.status,
    taskId: subtask.taskId,
    createdAt: subtask.createdAt,
    updatedAt: subtask.updatedAt,
  };
}
