import { generateUser } from '@tasker/shared';
import { registerUser, login } from './auth.utils.e2e';
import { getProfile } from './users.utils.e2e';

describe('GET /users/me', () => {
  it("should return user's profile", async () => {
    const user = generateUser();
    const {
      data: { id },
    } = await registerUser(user);
    const {
      data: { accessToken },
    } = await login(user);

    const res = await getProfile(accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: id,
      email: user.email,
      username: user.username,
    });
  });
});
