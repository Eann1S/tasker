import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis, { RedisKey, RedisValue } from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private redis: Redis) {}
    
    async set(key: RedisKey, value: RedisValue, ttl: number) {
        return this.redis.set(key, value, 'EX', ttl)
    }

    async exists(key: RedisKey) {
      return !!(await this.redis.exists(key));
    }

    async del(key: RedisKey) {
        return this.redis.del(key);
    }
}
