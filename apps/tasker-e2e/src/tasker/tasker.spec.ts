import { createUser } from '@tasker/shared';
import { login, registerUser } from './utils.e2e';

describe('POST /auth/register', () => {
  it('should register a user', async () => {
    const user = createUser();

    const res = await registerUser(user);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      email: user.email,
      username: user.username,
    });
  });

  it('should not register a user when one with given email already exists', async () => {
    const user = createUser();
    await registerUser(user);

    const res = await registerUser(user);

    expect(res.status).toBe(409);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`User with email ${user.email} already exists`)
    });
  });
});

describe('POST /auth/login', () => {
  it('should login', async () => {
    const user = createUser();
    await registerUser(user);

    const res = await login(user);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should not login when user does not exist', async () => {
    const user = createUser();

    const res = await login(user);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`User with email ${user.email} not found.`)
    });
  });

  it('should not login when user password is invalid', async () => {
    const user = createUser();
    await registerUser(user);
    user.password = 'invalid';

    const res = await login(user);

    expect(res.status).toBe(401);
    expect(res.data).toMatchObject({
      message: expect.stringMatching('Invalid credentials')
    });
  });
});
