import { createUser } from '@tasker/shared';
import { registerUser } from './utils.e2e';

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
