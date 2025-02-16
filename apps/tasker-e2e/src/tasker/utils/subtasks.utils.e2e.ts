import { Subtask } from '@prisma/client';
import {
  CreateSubtaskDto,
  generateCreateSubtaskDto,
  SubtaskDto,
  TaskDto,
  UpdateSubtaskDto,
} from '@tasker/shared';
import axios from 'axios';
import { createRandomTask } from './tasks.utils.e2e';

export async function createSubtask(
  taskId: string,
  dto: CreateSubtaskDto,
  token: string
) {
  return axios.post<SubtaskDto>(
    `/subtasks/${taskId}`,
    {
      title: dto.title,
      status: dto.status,
    },
    getHeaders(token)
  );
}

export async function createRandomSubtask() {
  const { task, accessToken } = await createRandomTask();
  const dto = generateCreateSubtaskDto();
  const { data } = await createSubtask(task.id, dto, accessToken);
  return { subtask: data, task, accessToken };
}

export async function getSubtasks(taskId: string, token: string) {
  return axios.get<TaskDto[]>(`/subtasks/task/${taskId}`, getHeaders(token));
}

export async function updateSubtask(
  subtaskId: string,
  updateSubtaskDto: UpdateSubtaskDto,
  token: string
) {
  return axios.put<TaskDto>(
    `/subtasks/${subtaskId}`,
    {
      title: updateSubtaskDto.title,
      status: updateSubtaskDto.status,
    },
    getHeaders(token)
  );
}

export async function deleteSubtask(subtaskId: string, token: string) {
  return axios.delete<void>(`/subtasks/${subtaskId}`, getHeaders(token));
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
