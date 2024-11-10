import { User } from '@prisma/client';
import { generateUser, JwtDto, UserDto } from '@tasker/shared';
import axios from 'axios';

export async function registerUser(user: User) {
  return axios.post<UserDto>('/auth/register', {
    email: user.email,
    username: user.username,
    password: user.password,
  });
}

export async function login(user: User) {
  return axios.post<JwtDto>('/auth/login', {
    email: user.email,
    password: user.password,
  });
}

export async function createUser(user: User) {
  const {
    data: { id },
  } = await registerUser(user);
  const { data } = await login(user);
  return { ...data, id };
}

export async function createRandomUser() {
  const user = generateUser();
  const {
    data: { id },
  } = await registerUser(user);
  const { data } = await login(user);
  return { ...data, userId: id };
}

export async function logout(accessToken: string) {
  return axios.post<void>('/auth/logout', {}, getHeaders(accessToken));
}

export async function refresh_token(refreshToken: string) {
  return axios.post<JwtDto>(
    '/auth/refresh-token',
    {},
    getHeaders(refreshToken)
  );
}

function getHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
