import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLabelDto, PrismaService } from '@tasker/shared';
import { mapLabelToDto } from './labels.mappings';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async createLabel(dto: CreateLabelDto) {
    try {
      Logger.debug('Creating label');

      const label = await this.prisma.label.create({ data: dto });

      Logger.debug(`Label with id ${label.id} created`);
      return mapLabelToDto(label);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create label');
    }
  }

  async getLabels() {
    try {
      Logger.debug('Getting labels');

      const labels = await this.prisma.label.findMany();
      return labels.map(mapLabelToDto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('An error occured');
    }
  }

  async deleteLabel(id: string) {
    try {
      Logger.debug(`Deleting label with id ${id}`);

      await this.prisma.label.delete({ where: { id } });

      Logger.debug(`Label with id ${id} deleted`);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Label with id ${id} not found`);
    }
  }
}
