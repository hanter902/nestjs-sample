import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
// import { CreateTaskDto } from './dto/create-task-dto';
// import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user: User) {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Put('/:id/status')
    async updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus) {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
