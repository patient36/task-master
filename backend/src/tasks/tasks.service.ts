import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthedUser } from 'src/common/types/authedUser';
import { Priority, TaskStatus } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  private readonly logger = new Logger(TasksService.name);

  async create(dto: CreateTaskDto, AuthedUser: AuthedUser) {
    try {

      if (dto.dueTime && new Date(dto.dueTime) < new Date()) throw new HttpException('Due time must be in the future', HttpStatus.BAD_REQUEST);

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

  async findAll(page = 1, limit = 20, AuthedUser: AuthedUser) {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * limit;
      const tasks = await this.prisma.task.findMany({ skip, take: limit, where: { creatorId: AuthedUser.id }, orderBy: { createdAt: 'desc' } });
      const total = await this.prisma.task.count({ where: { creatorId: AuthedUser.id } });

      return { page, limit, size: tasks.length, total, tasks }

    } catch (error) {
      this.logger.error(error.message, error.stack);

      if (error instanceof HttpException) throw error

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
}
