import { generateCreateLabelDto, generateCreateTaskDto } from '@tasker/shared';
import {
  assignLabelsToTask,
  createLabelsForTask,
  createRandomTask,
  createTask,
  deleteTask,
  getTask,
  removeLabelsFromTask,
  updateTask,
} from './utils/tasks.utils.e2e';
import { createRandomLabel } from './utils/labels.utils.e2e';
import { createRandomUser } from './utils/auth.utils.e2e';
import { createRandomTeam } from './utils/teams.utils.e2e';

describe('Tasks e2e tests', () => {
  describe('POST /tasks', () => {
    it('should create task', async () => {
      const { user, accessToken } = await createRandomUser();
      const task = generateCreateTaskDto();

      const res = await createTask(task, accessToken);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.toISOString(),
        status: task.status,
        creator: {
          id: user.id,
        },
      });
    });

    it('should create task with assignee', async () => {
      const { user, accessToken } = await createRandomUser();
      const { user: assignee } = await createRandomUser();
      const task = generateCreateTaskDto({ assigneeId: assignee.id });

      const res = await createTask(task, accessToken);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.toISOString(),
        status: task.status,
        creator: {
          id: user.id,
        },
        assignee: {
          id: assignee.id,
        },
      });
    });

    it('should create task with team', async () => {
      const { team, user, accessToken } = await createRandomTeam();
      const task = generateCreateTaskDto({ teamId: team.id });

      const res = await createTask(task, accessToken);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.toISOString(),
        status: task.status,
        creator: {
          id: user.id,
        },
        teamId: team.id,
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return task', async () => {
      const { task, accessToken } = await createRandomTask();

      const res = await getTask(task.id, accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toEqual(task);
    });

    it('should not return task when task was not found', async () => {
      const { accessToken } = await createRandomTask();

      const res = await getTask('id', accessToken);

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: expect.stringMatching(`task with id ${'id'} not found`),
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task', async () => {
      const { task, accessToken } = await createRandomTask();
      const updateTaskData = generateCreateTaskDto();

      const res = await updateTask(
        task.id,
        {
          title: updateTaskData.title,
          description: updateTaskData.description,
          priority: updateTaskData.priority,
          dueDate: updateTaskData.dueDate,
          status: updateTaskData.status,
        },
        accessToken
      );

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: task.id,
        title: updateTaskData.title,
        description: updateTaskData.description,
        priority: updateTaskData.priority,
        dueDate: updateTaskData.dueDate.toISOString(),
        status: updateTaskData.status,
        creator: {
          id: task.creator.id,
        },
      });
    });

    it('should not update task when task was not found', async () => {
      const { accessToken } = await createRandomTask();

      const res = await updateTask('id', {}, accessToken);

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: expect.stringMatching(`task with id ${'id'} not found`),
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      const { task, accessToken } = await createRandomTask();

      const res = await deleteTask(task.id, accessToken);

      expect(res.status).toBe(200);
    });

    it('should not delete task when task was not found', async () => {
      const { accessToken } = await createRandomTask();

      const res = await deleteTask('id', accessToken);

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: expect.stringMatching(`task with id ${'id'} not found`),
      });
    });
  });

  describe('POST /tasks/:id/labels', () => {
    it('should create labels for task', async () => {
      const { accessToken, task } = await createRandomTask();
      const label = generateCreateLabelDto();

      const res = await createLabelsForTask(task.id, [label], accessToken);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        ...task,
        labels: [
          {
            id: expect.any(String),
            name: label.name,
          },
        ],
      });
    });
  });

  describe('PUT /tasks/:id/labels', () => {
    it('should assign labels to task', async () => {
      const { accessToken, task } = await createRandomTask();
      const label = await createRandomLabel(accessToken);

      const res = await assignLabelsToTask(task.id, [label.id], accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        ...task,
        labels: [label],
      });
    });

    it('should not assign labels to task when labels not found', async () => {
      const { accessToken, task } = await createRandomTask();

      const res = await assignLabelsToTask(task.id, ['id'], accessToken);

      expect(res.status).toBe(500);
      expect(res.data).toMatchObject({
        message: expect.stringMatching(
          `Failed to assign labels to task ${task.id}`
        ),
      });
    });
  });

  describe('DELETE /tasks/:id/labels', () => {
    it('should remove labels from task', async () => {
      const { accessToken, task } = await createRandomTask();
      const label = await createRandomLabel(accessToken);
      await assignLabelsToTask(task.id, [label.id], accessToken);

      const res = await removeLabelsFromTask(task.id, [label.id], accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        ...task,
        labels: [],
      });
    });
  });
});
