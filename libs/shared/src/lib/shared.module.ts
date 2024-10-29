import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    RedisModule.forRoot({
      url: process.env.REDIS_URL,
      type: 'single',
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {}
