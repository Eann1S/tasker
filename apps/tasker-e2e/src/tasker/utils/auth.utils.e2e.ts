import { User } from '@prisma/client';
import { generateRegisterDto, JwtDto, LoginDto, RegisterDto, UserDto } from '@tasker/shared';
import axios from 'axios';

export async function registerUser(dto: RegisterDto) {
  return axios.post<UserDto>('/auth/register', {
    email: dto.email,
    username: dto.username,
    password: dto.password,
  });
}

export async function login(user: LoginDto) {
  return axios.post<JwtDto>('/auth/login', {
    email: user.email,
    password: user.password,
  });
}

export async function createUser(dto: RegisterDto) {
  const { data: createdUser } = await registerUser(dto);
  const res = await login(dto);
  const cookies = res.headers['set-cookie'][0];
  return { ...res.data, user: createdUser, cookies };
}

export async function createRandomUser() {
  const user = generateRegisterDto();
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
