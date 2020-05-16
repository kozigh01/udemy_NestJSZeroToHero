import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto);
        }

        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    // createTask(@Body() body): Task {
    // createTask(
    //     @Body('title') title: string, 
    //     @Body('description') desc: string,
    // ): Task {
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
        return this.tasksService.updateTaskStatus(id, status);
    }
    // @Patch()
    // updateTaskStatus(@Body() updateTaskDto: UpdateTaskDto): Task {
    //     console.log(updateTaskDto);
    //     return this.tasksService.updateTaskById(updateTaskDto);
    // }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): Task {
        return this.tasksService.deleteTaskById(id);
    }
}
