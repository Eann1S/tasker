import { generateUser } from '@tasker/shared';
import { login, logout, refresh_token, registerUser } from './auth.utils.e2e';
import { Redis } from 'ioredis';

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
      refreshToken: expect.any(String),
    });
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
    const user = generateUser();
    await registerUser(user);
    const {
      data: { accessToken },
    } = await login(user);

    const res = await logout(accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toBe('');
  });

  it('should not logout if accessToken is invalid', async () => {
    const user = generateUser();
    await registerUser(user);
    await login(user);

    const res = await logout('invalid token');

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Token is invalid'),
    });
  });
});

describe('POST /auth/refresh-token', () => {
  it('should refresh token', async () => {
    const user = generateUser();
    await registerUser(user);
    const {
      data: { refreshToken },
    } = await login(user);

    const res = await refresh_token(refreshToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should not refresh token if refresh token is invalid', async () => {
    const user = generateUser();
    await registerUser(user);
    await login(user);

    const res = await refresh_token('invalid token');

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Token is invalid'),
    });
  });

  it('should not refresh token if refresh token does not exist', async () => {
    const redis = new Redis(process.env.REDIS_URL);
    const user = generateUser();
    const {
      data: { id },
    } = await registerUser(user);
    const {
      data: { refreshToken },
    } = await login(user);
    redis.del(id);

    const res = await refresh_token(refreshToken);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Invalid refresh token'),
    });
  });
});
