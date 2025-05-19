import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AuthTokenService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) { }

    async storeToken(token: string, userId: string, ttl: number): Promise<void> {
        await this.redisClient.set(token, userId, 'EX', ttl);
    }

    async getUserIdByToken(token: string): Promise<string | null> {
        return await this.redisClient.get(token);
    }

    async invalidateToken(token: string): Promise<void> {
        await this.redisClient.del(token);
    }
}