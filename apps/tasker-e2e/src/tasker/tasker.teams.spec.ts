import { generateTeamData } from '@tasker/shared';
import { createRandomUser } from './utils/auth.utils.e2e';
import {
  addUserToTeam,
  assignTaskToTeam,
  createRandomTeam,
  createTeam,
  getTeam,
  getTeams,
  removeTaskFromTeam,
  removeUserFromTeam,
} from './utils/teams.utils.e2e';
import { TeamRole } from '@prisma/client';
import { createRandomTask } from './utils/tasks.utils.e2e';

describe('Teams e2e tests', () => {
  describe('POST /teams', () => {
    it('should create a team', async () => {
      const { accessToken, user } = await createRandomUser();
      const data = generateTeamData();

      const res = await createTeam(data, accessToken);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        id: expect.any(String),
        name: data.name,
        members: [
          expect.objectContaining({
            userId: user.id,
            role: TeamRole.admin,
          }),
        ],
      });
    });
  });

  describe('GET /teams/:teamId', () => {
    it('should return a team', async () => {
      const { accessToken, team } = await createRandomTeam();

      const res = await getTeam(team.id, accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: team.id,
        name: team.name,
        members: team.members,
        tasks: team.tasks,
      });
    });

    it('should not return team when team was not found', async () => {
      const { accessToken } = await createRandomTeam();

      const res = await getTeam('invalid', accessToken);

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: `Team with id invalid not found`,
      });
    });
  });

  describe('GET /teams', () => {
    it('should return teams', async () => {
      const { accessToken, team } = await createRandomTeam();

      const res = await getTeams(accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toContainEqual(
        expect.objectContaining({
          id: team.id,
          name: team.name,
          members: team.members,
          tasks: team.tasks,
        })
      );
    });
  });

  describe('POST /:teamId/user/:userId', () => {
    it('should add user to team', async () => {
      const { accessToken, team } = await createRandomTeam();
      const { user } = await createRandomUser();

      const res = await addUserToTeam(team.id, user.id, accessToken);

      expect(res.status).toBe(201);
      expect(res.data.members).toContainEqual(
        expect.objectContaining({
          userId: user.id,
          role: TeamRole.member,
        })
      );
    });

    it('should not add user to team when not admin', async () => {
      const { team, accessToken: adminAccessToken } = await createRandomTeam();
      const { user, accessToken } = await createRandomUser();
      await addUserToTeam(team.id, user.id, adminAccessToken);
      const { user: secondUser } = await createRandomUser();

      const res = await addUserToTeam(team.id, secondUser.id, accessToken);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `User with id ${user.id} is not an admin of team with id ${team.id}`,
      });
    });
  });

  describe('DELETE /:teamId/user/:userId', () => {
    it('should remove user from team', async () => {
      const { accessToken, team } = await createRandomTeam();
      const { user } = await createRandomUser();
      await addUserToTeam(team.id, user.id, accessToken);

      const res = await removeUserFromTeam(team.id, user.id, accessToken);

      expect(res.status).toBe(200);
    });

    it('should leave from team', async () => {
      const { team, accessToken: adminAccessToken } = await createRandomTeam();
      const { user, accessToken } = await createRandomUser();
      await addUserToTeam(team.id, user.id, adminAccessToken);

      const res = await removeUserFromTeam(team.id, user.id, accessToken);

      expect(res.status).toBe(200);
    });

    it('should not remove user from team when not admin', async () => {
      const { team, accessToken: adminAccessToken } = await createRandomTeam();
      const { user, accessToken } = await createRandomUser();
      await addUserToTeam(team.id, user.id, adminAccessToken);
      const { user: secondUser } = await createRandomUser();
      await addUserToTeam(team.id, secondUser.id, adminAccessToken);

      const res = await removeUserFromTeam(team.id, secondUser.id, accessToken);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `User with id ${user.id} is not an admin of team with id ${team.id}`,
      });
    });
  });

  describe('POST /:teamId/task/:taskId', () => {
    it('should assign task to team', async () => {
      const { accessToken, team } = await createRandomTeam();
      const { task } = await createRandomTask();

      const res = await assignTaskToTeam(team.id, task.id, accessToken);

      expect(res.status).toBe(201);
      expect(res.data.tasks).toEqual([
        expect.objectContaining({ id: task.id }),
      ]);
    });

    it('should not assign task to team when not admin', async () => {
      const { team, accessToken: adminAccessToken } = await createRandomTeam();
      const { user, accessToken } = await createRandomUser();
      await addUserToTeam(team.id, user.id, adminAccessToken);
      const { task } = await createRandomTask();

      const res = await assignTaskToTeam(team.id, task.id, accessToken);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `User with id ${user.id} is not an admin of team with id ${team.id}`,
      });
    });
  });

  describe('DELETE /:teamId/task/:taskId', () => {
    it('should remove task from team', async () => {
      const { accessToken, team } = await createRandomTeam();
      const { task } = await createRandomTask();
      await assignTaskToTeam(team.id, task.id, accessToken);

      const res = await removeTaskFromTeam(team.id, task.id, accessToken);

      expect(res.status).toBe(200);
      expect(res.data.tasks).toEqual([
        expect.not.objectContaining({ id: task.id }),
      ]);
    });

    it('should not remove task from team when not admin', async () => {
      const { team, accessToken: adminAccessToken } = await createRandomTeam();
      const { user, accessToken } = await createRandomUser();
      await addUserToTeam(team.id, user.id, adminAccessToken);
      const { task } = await createRandomTask();
      await assignTaskToTeam(team.id, task.id, adminAccessToken);

      const res = await removeTaskFromTeam(team.id, user.id, accessToken);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `User with id ${user.id} is not an admin of team with id ${team.id}`,
      });
    });
  });
});
