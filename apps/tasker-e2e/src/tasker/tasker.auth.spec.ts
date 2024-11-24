import { generateUser } from '@tasker/shared';
import { Redis } from 'ioredis';
import {
  registerUser,
  login,
  logout,
  refreshTokens,
  createRandomUser,
} from './utils/auth.utils.e2e';
import { AxiosResponse } from 'axios';

describe('POST /auth/register', () => {
  it('should register a user', async () => {
    const user = generateUser();
    const res = await registerUser(user);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      email: user.email,
      username: user.username,
    });
  });

  it('should not register a user when one with given email already exists', async () => {
    const user = generateUser();
    await registerUser(user);

    const res = await registerUser(user);

    expect(res.status).toBe(409);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(
        `User with email ${user.email} already exists`
      ),
    });
  });
});

describe('POST /auth/login', () => {
  it('should login', async () => {
    const user = generateUser();
    await registerUser(user);

    const res = await login(user);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      accessToken: expect.any(String),
    });
    const accessToken = await extractCookieFromResponse(res, 'accessToken');
    const refreshToken = await extractCookieFromResponse(res, 'refreshToken');
    expect(accessToken).toEqual(expect.any(String));
    expect(refreshToken).toEqual(expect.any(String));
  });

  it('should not login when user does not exist', async () => {
    const user = generateUser();

    const res = await login(user);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(
        `User with email ${user.email} not found.`
      ),
    });
  });

  it('should not login when user password is invalid', async () => {
    const user = generateUser();
    await registerUser(user);
    user.password = 'invalid';

    const res = await login(user);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Invalid credentials'),
    });
  });
});

describe('POST /auth/logout', () => {
  it('should logout', async () => {
    const { accessToken, cookies } = await createRandomUser();

    const res = await logout(accessToken, cookies);

    expect(res.status).toBe(200);
    const resAccessToken = await extractCookieFromResponse(res, 'accessToken');
    const refreshToken = await extractCookieFromResponse(res, 'refreshToken');
    expect(resAccessToken).toEqual('');
    expect(refreshToken).toEqual('');
  });

  it('should not logout if accessToken is invalid', async () => {
    const { cookies } = await createRandomUser();

    const res = await logout('invalid token', cookies);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Token is invalid'),
    });
  });
});

describe('POST /auth/refresh-token', () => {
  it('should refresh token', async () => {
    const { cookies } = await createRandomUser();

    const res = await refreshTokens(cookies);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      accessToken: expect.any(String),
    });
    const accessToken = await extractCookieFromResponse(res, 'accessToken');
    const refreshToken = await extractCookieFromResponse(res, 'refreshToken');
    expect(accessToken).toEqual(expect.any(String));
    expect(refreshToken).toEqual(expect.any(String));
  });

  it('should not refresh token if refresh token is invalid', async () => {
    let { cookies } = await createRandomUser();
    cookies = await replaceCookie(cookies, 'refreshToken', 'invalid');

    const res = await refreshTokens(cookies);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Token is invalid'),
    });
  });

  it('should not refresh token if refresh token is missing', async () => {
    let { cookies } = await createRandomUser();
    cookies = await replaceCookie(cookies, 'refreshToken', '');

    const res = await refreshTokens(cookies);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Refresh token is missing'),
    });
  });

  it('should not refresh token if refresh tokens does not exist in cache', async () => {
    const redis = new Redis(process.env.REDIS_URL);
    const { cookies, user } = await createRandomUser();
    redis.del(user.id);

    const res = await refreshTokens(cookies);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Refresh token does not exist in cache'),
    });
  });
});

async function extractCookieFromResponse<T, K>(
  res: AxiosResponse<T, K>,
  cookieName: string
) {
  const cookies = res.headers['set-cookie'];
  return extractCookie(cookies, cookieName);
}

async function extractCookie(cookies: string[], cookieName: string) {
  return cookies
    .flatMap((str) => str.split('; '))
    .find((row) => row.startsWith(`${cookieName}=`))
    .split('=')[1];
}

async function replaceCookie(
  cookies: string[],
  cookieName: string,
  value: string
) {
  return cookies
    .flatMap((str) => str.split('; '))
    .filter((row) => row.startsWith(`${cookieName}=`))
    .map(() => `${cookieName}=${value}`);
}
