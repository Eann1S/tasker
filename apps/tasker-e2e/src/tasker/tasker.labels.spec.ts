import { generateLabel } from '@tasker/shared';
import { createRandomUser } from './utils/auth.utils.e2e';
import {
  createLabel,
  createRandomLabel,
  deleteLabel,
  getLabels,
} from './utils/labels.utils.e2e';

describe('POST /labels', () => {
  it('should create label', async () => {
    const { accessToken } = await createRandomUser();
    const label = generateLabel();

    const res = await createLabel(label, accessToken);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      name: label.name,
    });
  });
});

describe('GET /labels', () => {
  it('should return labels', async () => {
    const { accessToken } = await createRandomUser();
    const labels = [
      await createRandomLabel(accessToken),
      await createRandomLabel(accessToken),
    ];

    const res = await getLabels(accessToken);

    expect(res.status).toBe(200);
    expect(res.data).toEqual(expect.arrayContaining(labels));
  });
});

describe('DELETE /labels/:id', () => {
  it('should delete label', async () => {
    const { accessToken } = await createRandomUser();
    const { id } = await createRandomLabel(accessToken);

    const res = await deleteLabel(id, accessToken);

    expect(res.status).toBe(200);
  });

  it('should not delete label when label was not found', async () => {
    const { accessToken } = await createRandomUser();

    const res = await deleteLabel('id', accessToken);

    expect(res.status).toBe(404);
    expect(res.data).toMatchObject({
      message: expect.stringMatching(`Label with id ${'id'} not found`),
    });
  });
});
