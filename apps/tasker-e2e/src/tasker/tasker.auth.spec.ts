import { generateRegisterDto } from '@tasker/shared';
import { Redis } from 'ioredis';
import {
  registerUser,
  login,
  logout,
  refreshTokens,
  createRandomUser,
} from './utils/auth.utils.e2e';

describe('POST /auth/register', () => {
  it('should register a user', async () => {
    const user = generateRegisterDto();
    const res = await registerUser(user);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      email: user.email,
      username: user.username,
    });
  });

  it('should not register a user when one with given email already exists', async () => {
    const user = generateRegisterDto();
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
    const user = generateRegisterDto();
    await registerUser(user);

    const res = await login(user);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      accessToken: expect.any(String),
    });
    expect(res.headers['set-cookie'][0]).toContain("refresh_token=");
  });

  it('should not login when user does not exist', async () => {
    const user = generateRegisterDto();

    const res = await login(user);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(
        `User with email ${user.email} not found.`
      ),
    });
  });

  it('should not login when user password is invalid', async () => {
    const user = generateRegisterDto();
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
    expect(res.headers['set-cookie'][0]).toContain("refresh_token=;");
  });

  it('should not logout if accessToken is invalid', async () => {
    const {cookies} = await createRandomUser();

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
    expect(res.headers['set-cookie'][0]).toContain("refresh_token=");
  });

  it('should not refresh token if refresh token is invalid', async () => {
    await createRandomUser();

    const res = await refreshTokens("refresh_token=invalid");

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Token is invalid'),
    });
  });

  it('should not refresh token if refresh token is missing', async () => {
    await createRandomUser();

    const res = await refreshTokens("");

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Refresh token is missing'),
    });
  });

  it('should not refresh token if refresh tokens does not exist', async () => {
    const redis = new Redis(process.env.REDIS_URL);
    const { user, cookies } = await createRandomUser();
    await redis.del(user.id);

    const res = await refreshTokens(cookies);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Refresh token does not exist'),
    });
  });
});
