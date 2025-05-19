import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async saveToken(email: string, token: string) {
    await this.redis.setex(`reset:${email}`, 600, token);
  }

  async verifyToken(email: string, token: string): Promise<boolean> {
    const stored = await this.redis.get(`reset:${email}`);
    return stored === token;
  }

  async removeToken(email: string) {
    await this.redis.del(`reset:${email}`);
  }
}
