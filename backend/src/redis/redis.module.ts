import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { OtpService } from './otp.service';
import { AuthTokenService } from './auth-token.service';

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
    AuthTokenService,
  ],
  exports: ['REDIS_CLIENT', OtpService, AuthTokenService]
})
export class RedisModule { }
