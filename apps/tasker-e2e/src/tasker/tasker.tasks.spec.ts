import { generateLabel, generateTask } from '@tasker/shared';
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
} from './utils/tasks.utils.e2e';
import { createRandomLabel } from './utils/labels.utils.e2e';
import { createRandomUser } from './utils/auth.utils.e2e';

describe('POST /tasks', () => {
  it('should create task', async () => {
    const { user, accessToken } = await createRandomUser();
    const task = generateTask({ creatorId: user.id });

    const res = await createTask(task, accessToken);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString(),
      status: task.status,
      creatorId: user.id,
    });
  });
});

describe('GET /tasks/:userId', () => {
  it('should return tasks for user', async () => {
    const { task, accessToken } = await createRandomTask();

    const res = await getTasks(task.creator.id, accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toEqual(expect.arrayContaining([task]));
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
    const updateTaskData = generateTask();

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
      creatorId: task.creator.id,
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
    const label = generateLabel();

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
