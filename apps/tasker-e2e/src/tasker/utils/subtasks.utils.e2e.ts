import { Subtask } from '@prisma/client';
import {
  generateSubtask,
  SubtaskDto,
  TaskDto,
  UpdateSubtaskDto,
} from '@tasker/shared';
import axios from 'axios';
import { createRandomTask } from './tasks.utils.e2e';

export async function createSubtask(
  taskId: string,
  subtask: Subtask,
  token: string
) {
  return axios.post<SubtaskDto>(
    `/subtasks/${taskId}`,
    {
      title: subtask.title,
      status: subtask.status,
    },
    getHeaders(token)
  );
}

export async function createRandomSubtask() {
  const { task, accessToken } = await createRandomTask();
  const subtask = generateSubtask();
  const { data } = await axios.post<SubtaskDto>(
    `/subtasks/${task.id}`,
    {
      title: subtask.title,
      status: subtask.status,
    },
    getHeaders(accessToken)
  );
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
