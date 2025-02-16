import { CreateLabelDto, generateCreateLabelDto, LabelDto } from '@tasker/shared';
import axios from 'axios';

export async function createLabel(dto: CreateLabelDto, token: string) {
  return axios.post<LabelDto>(
    '/labels',
    { name: dto.name },
    getHeaders(token)
  );
}

export async function createRandomLabel(token: string) {
  const dto = generateCreateLabelDto();
  const { data } = await createLabel(dto, token);
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
