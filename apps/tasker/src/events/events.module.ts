import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
