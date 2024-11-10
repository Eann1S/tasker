import { generateLabel, generateTask } from '@tasker/shared';
import { createRandomUser } from './auth.utils.e2e';
import {
  assignLabelsToTask,
  createLabelsForTask,
  createRandomTask,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  removeLabelsFromTask,
  updateTask,
} from './tasks.utils.e2e';
import { createRandomLabel } from './labels.utils.e2e';

describe('POST /tasks', () => {
  it('should create task', async () => {
    const { userId, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: userId });

    const res = await createTask(task, accessToken);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString(),
      status: task.status,
      creatorId: userId,
    });
  });
});

describe('GET /tasks/:userId', () => {
  it('should return tasks for user', async () => {
    const { userId, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: userId });
    await createTask(task, accessToken);

    const res = await getTasks(userId, accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject([
      {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.toISOString(),
        status: task.status,
        creatorId: userId,
      },
    ]);
  });
});

describe('GET /tasks/:id', () => {
  it('should return task', async () => {
    const { userId, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: userId });
    const {
      data: { id },
    } = await createTask(task, accessToken);

    const res = await getTask(id, accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString(),
      status: task.status,
      creatorId: userId,
    });
  });

  it('should not return task when task was not found', async () => {
    const { accessToken } = await createRandomTask();

    const res = await deleteTask('invalid id', accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`task with id ${'invalid id'} not found`),
    });
  });
});

describe('PUT /tasks/:id', () => {
  it('should update task', async () => {
    const { userId, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: userId });
    const {
      data: { id },
    } = await createTask(task, accessToken);
    const updateTaskData = generateTask();

    const res = await updateTask(
      id,
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
      title: updateTaskData.title,
      description: updateTaskData.description,
      priority: updateTaskData.priority,
      dueDate: updateTaskData.dueDate.toISOString(),
      status: updateTaskData.status,
      creatorId: userId,
    });
  });

  it('should not update task when task was not found', async () => {
    const { accessToken } = await createRandomTask();

    const res = await updateTask('invalid id', {}, accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`task with id ${'invalid id'} not found`),
    });
  });
});

describe('DELETE /tasks/:id', () => {
  it('should delete task', async () => {
    const { userId, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: userId });
    const {
      data: { id },
    } = await createTask(task, accessToken);

    const res = await deleteTask(id, accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toBe('');
  });

  it('should not delete task when task was not found', async () => {
    const { accessToken } = await createRandomTask();

    const res = await deleteTask('invalid id', accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`task with id ${'invalid id'} not found`),
    });
  });
});

describe('POST /tasks/:id/labels', () => {
  it('should create labels for task', async () => {
    const { accessToken, task } = await createRandomTask();
    const label = generateLabel();

    const res = await createLabelsForTask(task.id, [label], accessToken);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      creatorId: task.creator.id,
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
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      creatorId: task.creator.id,
      labels: [label],
    });
  });

  it('should not assign labels to task when labels not found', async () => {
    const { accessToken, task } = await createRandomTask();

    const res = await assignLabelsToTask(task.id, ['invalid id'], accessToken);

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
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      creatorId: task.creator.id,
      labels: [],
    });
  });
});
