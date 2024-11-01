import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLabelDto, PrismaService } from '@tasker/shared';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async createLabel(label: CreateLabelDto) {
    try {
      Logger.debug('Creating label');
      return await this.prisma.label.create({ data: label });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create label');
    }
  }

  async getLabels() {
    try {
      Logger.debug('Getting labels');
      return await this.prisma.label.findMany();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('An error occured');
    }
  }

  async deleteLabel(id: string) {
    try {
      Logger.debug(`Deleting label with id ${id}`);
      return await this.prisma.label.delete({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Label with id ${id} not found`);
    }
  }
}
