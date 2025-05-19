import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { OtpService } from './otp.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    OtpService,
  ],
  exports: ['REDIS_CLIENT', OtpService],
})
export class RedisModule {}
