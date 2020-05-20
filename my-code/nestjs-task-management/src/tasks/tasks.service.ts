import { Injectable, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository
    ) {}

    // private tasks: Task[] = [];

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto);
    }
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }

        return task;
    }

    // getTasksWithFilters(filter: GetTasksFilterDto): Task[] {
    //     const { status, search } = filter;

    //     let tasks = this.getAllTasks();
    //     if (status) {
    //         tasks = tasks.filter(t => t.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter(t => 
    //             t.title.includes(search)
    //             || t.description.includes(search)    
    //         )
    //     }

    //     return tasks;
    // }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        console.log(result);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found.`);
        }

        // const task = await this.taskRepository.findOne(id);
        // await this.taskRepository.remove(task);
    }

    async updateTaskStatus(id: number, newStatus: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = newStatus;
        await task.save();
        return task;
    }

}
