import { Label, Subtask, Task, User } from '@prisma/client';
import { TaskDto } from '@tasker/shared';
import { mapUserToDto } from '../users/users.mappings';
import { mapLabelToDto } from '../labels/labels.mappings';
import { mapSubtaskToDto } from '../subtasks/subtasks.mappings';

export function mapTaskToDto(
  task: Task & { creator?: User; labels?: Label[]; subtasks?: Subtask[] }
): TaskDto {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    creator: mapUserToDto(task.creator),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    labels: task.labels?.map(mapLabelToDto),
    subtasks: task.subtasks?.map(mapSubtaskToDto),
    teamId: task.teamId,
  };
}
