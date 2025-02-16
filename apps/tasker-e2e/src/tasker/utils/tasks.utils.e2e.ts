import { Task } from '@prisma/client';
import {
  CreateLabelDto,
  CreateTaskDto,
  generateCreateTaskDto,
  TaskDto,
  UpdateTaskDto,
} from '@tasker/shared';
import axios from 'axios';
import { createRandomUser } from './auth.utils.e2e';

export async function createTask(dto: CreateTaskDto, token: string) {
  return axios.post<TaskDto>(
    `/tasks`,
    {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueDate: dto.dueDate,
      status: dto.status,
      assigneeId: dto.assigneeId,
      teamId: dto.teamId,
    },
    getHeaders(token)
  );
}

export async function createRandomTask(overwrites: Partial<CreateTaskDto> = {}) {
  const { accessToken } = await createRandomUser();
  const dto = generateCreateTaskDto(overwrites);
  const { data } = await createTask(dto, accessToken);
  return { task: data, accessToken };
}

export async function getTask(taskId: string, token: string) {
  return axios.get<TaskDto>(`/tasks/${taskId}`, getHeaders(token));
}

export async function updateTask(
  taskId: string,
  updateTaskDto: UpdateTaskDto,
  token: string
) {
  return axios.put<TaskDto>(
    `/tasks/${taskId}`,
    {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      priority: updateTaskDto.priority,
      dueDate: updateTaskDto.dueDate,
      status: updateTaskDto.status,
    },
    getHeaders(token)
  );
}

export async function deleteTask(taskId: string, token: string) {
  return axios.delete<void>(`/tasks/${taskId}`, getHeaders(token));
}

export async function createLabelsForTask(
  taskId: string,
  labels: CreateLabelDto[],
  token: string
) {
  return axios.post<TaskDto>(
    `/tasks/${taskId}/labels`,
    labels,
    getHeaders(token)
  );
}

export async function assignLabelsToTask(
  taskId: string,
  labelIds: string[],
  token: string
) {
  return axios.put<TaskDto>(
    `/tasks/${taskId}/labels`,
    labelIds,
    getHeaders(token)
  );
}

export async function removeLabelsFromTask(
  taskId: string,
  labelIds: string[],
  token: string
) {
  return axios.delete<TaskDto>(`/tasks/${taskId}/labels`, {
    data: labelIds,
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
