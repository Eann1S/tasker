import { generateSubtask } from '@tasker/shared';
import {
  createRandomTask,
} from './utils/tasks.utils.e2e';
import {
  createRandomSubtask,
  createSubtask,
  deleteSubtask,
  getSubtasks,
  updateSubtask,
} from './utils/subtasks.utils.e2e';

describe('POST /subtasks/:taskId', () => {
  it('should create subtask', async () => {
    const { task, accessToken } = await createRandomTask();
    const subtask = generateSubtask();

    const res = await createSubtask(task.id, subtask, accessToken);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      title: subtask.title,
      status: subtask.status,
    });
  });
});

describe('GET /subtasks/:taskId', () => {
  it('should return subtasks for task', async () => {
    const {subtask, task, accessToken} = await createRandomSubtask();

    const res = await getSubtasks(task.id, accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject([subtask]);
  });
});

describe('PUT /subtasks/:id', () => {
  it('should update subtask', async () => {
    const {subtask, accessToken} = await createRandomSubtask();
    const updateSubtaskData = generateSubtask();

    const res = await updateSubtask(
      subtask.id,
      {
        title: updateSubtaskData.title,
        status: updateSubtaskData.status,
      },
      accessToken
    );

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id: subtask.id,
      title: updateSubtaskData.title,
      status: updateSubtaskData.status,
    });
  });

  it('should not update subtask when subtask was not found', async () => {
    const { accessToken } = await createRandomSubtask();

    const res = await updateSubtask('id', {}, accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`subtask with id ${'id'} not found`),
    });
  });
});

describe('DELETE /subtasks/:id', () => {
  it('should delete subtask', async () => {
    const {subtask, accessToken} = await createRandomSubtask();

    const res = await deleteSubtask(subtask.id, accessToken);

    expect(res.status).toBe(200);
  });

  it('should not delete subtask when subtask was not found', async () => {
    const {accessToken} = await createRandomSubtask();

    const res = await deleteSubtask('id', accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`subtask with id ${'id'} not found`),
    });
  });
});
