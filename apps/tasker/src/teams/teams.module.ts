import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { PrismaModule, SharedModule } from '@tasker/shared';

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}
