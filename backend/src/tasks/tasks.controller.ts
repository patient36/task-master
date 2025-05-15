import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthedUser } from 'src/common/types/authedUser';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post('/create')
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: AuthedUser) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get('/all')
  findAll(@Query('page') page: number, @Query('limit') limit: number, @CurrentUser() user: AuthedUser) {
    return this.tasksService.findAll(page, limit, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthedUser) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: AuthedUser) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthedUser) {
    return this.tasksService.remove(id, user);
  }
}
