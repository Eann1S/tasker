import { Task } from '@prisma/client';
import {
  CreateLabelDto,
  generateTask,
  TaskDto,
  UpdateTaskDto,
} from '@tasker/shared';
import axios from 'axios';
import { createRandomUser } from './auth.utils.e2e';

export async function createTask(task: Task, token: string) {
  return axios.post<TaskDto>(
    `/tasks`,
    {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
    },
    getHeaders(token)
  );
}

export async function createRandomTask() {
  const { user, accessToken } = await createRandomUser();
  const task = generateTask({ creatorId: user.id });
  const { data } = await createTask(task, accessToken);
  return { task: data, accessToken };
}

export async function getTasks(userId: string, token: string) {
  return axios.get<TaskDto[]>(`/tasks/user/${userId}`, getHeaders(token));
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
