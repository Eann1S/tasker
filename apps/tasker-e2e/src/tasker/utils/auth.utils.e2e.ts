import { User } from '@prisma/client';
import { generateUserData, JwtDto, UserDto } from '@tasker/shared';
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
  const { data: createdUser } = await registerUser(user);
  const res = await login(user);
  const cookies = res.headers['set-cookie'][0];
  return { ...res.data, user: createdUser, cookies };
}

export async function createRandomUser() {
  const user = generateUserData();
  return createUser(user);
}

export async function logout(accessToken: string, cookies: string) {
  return axios.post<void>(
    '/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      withCredentials: true,
    }
  );
}

export async function refreshTokens(cookies: string) {
  return axios.post<JwtDto>(
    '/auth/refresh-tokens',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      },
      withCredentials: true,
    }
  );
}
