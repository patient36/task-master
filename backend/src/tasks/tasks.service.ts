import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthedUser } from 'src/common/types/authedUser';
import { Priority, TaskStatus } from 'generated/prisma';
import { Prisma } from 'generated/prisma';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  private readonly logger = new Logger(TasksService.name);

  async create(dto: CreateTaskDto, AuthedUser: AuthedUser) {
    try {

      if (new Date(dto.dueTime).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) throw new HttpException('Due time must be today or in the future', HttpStatus.BAD_REQUEST);

      const task = await this.prisma.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          dueTime: dto.dueTime,
          creatorId: AuthedUser.id,
          priority: dto.priority as Priority
        }
      });
      return task
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Task creation failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(page = 1, limit = 20, authedUser: AuthedUser, status?: string) {
    try {
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * limit;

      const baseWhere = { creatorId: authedUser.id };
      const where = status ? { ...baseWhere, status: status as TaskStatus } : baseWhere;

      const statuses = ['PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED'] as const;

      const [tasks, total, ...statusCounts] = await Promise.all([
        this.prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.task.count({ where }),
        ...statuses.map((s) =>
          this.prisma.task.count({ where: { ...baseWhere, status: s } })
        ),
      ]);

      const stats = Object.fromEntries(
        statuses.map((s, i) => [s.toLowerCase(), statusCounts[i]])
      );
      const totalPages = Math.ceil(total / limit);

      stats.total = await this.prisma.task.count({ where: baseWhere });

      return {
        page: safePage,
        limit,
        size: tasks.length,
        totalPages,
        total,
        stats,
        tasks,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to fetch tasks',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findOne(id: string, AuthedUser: AuthedUser) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id, creatorId: AuthedUser.id } });
      if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      return task
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Task not found',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, dto: UpdateTaskDto, AuthedUser: AuthedUser) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id, creatorId: AuthedUser.id } });
      if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: {
          title: dto.title ?? task.title,
          description: dto.description ?? task.description,
          dueTime: dto.dueTime ?? task.dueTime,
          status: dto.status as TaskStatus ?? task.status,
          priority: dto.priority as Priority ?? task.priority
        }
      });

      return updatedTask
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Task update failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, AuthedUser: AuthedUser) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id, creatorId: AuthedUser.id } });
      if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      const deletedTask = await this.prisma.task.delete({ where: { id } });
      return { message: 'Task deleted successfully', task: deletedTask }
    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

      throw new HttpException(
        {
          message: 'Task deletion failed',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(query: string, page = 1, limit = 20, AuthedUser: AuthedUser) {
    try {
      const safePage = Math.max(1, page);
      const skip = (safePage - 1) * limit;

      const where = {
        creatorId: AuthedUser.id,
        title: {
          contains: query,
          mode: Prisma.QueryMode.insensitive,
        },
      };

      const [tasks, total] = await Promise.all([
        this.prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.task.count({ where }),
      ]);

      return {
        page: safePage,
        limit,
        size: tasks.length,
        total,
        tasks,
      };

    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          message: 'Failed to search tasks',
          error: error.message || 'Unexpected error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async handleOverdueTasks() {
    try {
      const now = new Date();
      const overdueTasks = await this.prisma.task.findMany({
        where: {
          dueTime: {
            lt: now,
          },
          status: TaskStatus.PENDING,
        },
      });

      for (const task of overdueTasks) {
        await this.prisma.task.update({
          where: { id: task.id },
          data: { status: TaskStatus.OVERDUE },
        });
      }
      this.logger.log(`Updated ${overdueTasks.length} pending tasks to overdue.`);
    } catch (error) {
      this.logger.error('Error handling overdue tasks', error);
    }
  }
}
