import { LabelsService } from './labels.service';
import { createLabel, PrismaService } from '@tasker/shared';
import { Mocked, TestBed } from '@suites/unit';
import { Label } from '@prisma/client';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('LabelsService', () => {
  let service: LabelsService;
  let prisma: Mocked<PrismaService>;
  let label: Label;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(LabelsService).compile();

    service = unit;
    prisma = unitRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    label = createLabel();
  });

  describe('create label', () => {
    it('should create a label', async () => {
      const labelDto = { name: label.name };
      prisma.label.create.mockResolvedValue(label);

      const actual = await service.createLabel(labelDto);

      expect(actual).toEqual(label);
    });

    it('should not create a label', async () => {
      const labelDto = { name: label.name };
      prisma.label.create.mockRejectedValue(new Error('error'));

      expect(service.createLabel(labelDto)).rejects.toThrow(
        new InternalServerErrorException('Failed to create label')
      );
    });
  });

  describe('get labels', () => {
    it('should return labels', async () => {
      const labels = [label];
      prisma.label.findMany.mockResolvedValue(labels);

      const actual = await service.getLabels();

      expect(actual).toEqual(labels);
    });
  });

  describe('delete label', () => {
    it('should delete label', async () => {
      prisma.label.delete.mockResolvedValue(label);

      const actual = await service.deleteLabel(label.id);

      expect(actual).toEqual(label);
    });

    it('should not delete label when it does not exist', async () => {
      prisma.label.delete.mockRejectedValue(new Error('error'));

      expect(service.deleteLabel(label.id)).rejects.toThrow(
        new NotFoundException(`Label with id ${label.id} not found`)
      );
    });
  });
});
