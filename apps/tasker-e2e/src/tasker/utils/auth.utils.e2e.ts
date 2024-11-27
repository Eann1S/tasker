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
  const res = await axios.post<JwtDto>('/auth/login', {
    email: user.email,
    password: user.password,
  });
  return res;
}

export async function createUser(user: User) {
  const { data: createdUser } = await registerUser(user);
  const res = await login(user);
  return { ...res.data, user: createdUser };
}

export async function createRandomUser() {
  const user = generateUser();
  return createUser(user);
}

export async function logout(accessToken: string) {
  return axios.post<void>(
    '/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function refreshTokens(refreshToken?: string) {
  return axios.post<JwtDto>(
    '/auth/refresh-tokens',
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
