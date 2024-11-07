import { User } from '@prisma/client';
import axios from 'axios';

export async function registerUser(user: User) {
  return axios.post('/auth/register', {
    email: user.email,
    username: user.username,
    password: user.password,
  });
}

export async function login(user: User) {
  return axios.post('/auth/login', {
    email: user.email,
    password: user.password,
  });
}
