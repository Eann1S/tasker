import { Label } from '@prisma/client';
import { generateLabel, LabelDto } from '@tasker/shared';
import axios from 'axios';

export async function createLabel(label: Label, token: string) {
  return axios.post<LabelDto>(
    '/labels',
    { name: label.name },
    getHeaders(token)
  );
}

export async function createRandomLabel(token: string) {
  const label = generateLabel();
  const { data } = await axios.post<LabelDto>(
    '/labels',
    { name: label.name },
    getHeaders(token)
  );
  return data;
}

export async function getLabels(token: string) {
  return axios.get<LabelDto[]>('/labels', getHeaders(token));
}

export async function deleteLabel(id: string, token: string) {
  return axios.delete<void>(`/labels/${id}`, getHeaders(token));
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
