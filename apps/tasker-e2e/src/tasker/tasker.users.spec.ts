import { getProfile } from './utils/users.utils.e2e';
import { createRandomUser } from './utils/auth.utils.e2e';

describe('GET /users/me', () => {
  it("should return user's profile", async () => {
    const {accessToken, user} = await createRandomUser();

    const res = await getProfile(accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });
});
