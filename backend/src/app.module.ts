import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jw-auth.guard';
import { TasksModule } from './tasks/tasks.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, PrismaModule, TasksModule, RedisModule, MailModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule { }
