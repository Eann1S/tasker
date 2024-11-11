import { UserDto } from '@tasker/shared';
import axios from 'axios';

export async function getProfile(token: string) {
  return axios.get<UserDto>('/users/me', getHeaders(token));
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
