import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    getTasksWithFilters(filter: GetTasksFilterDto): Task[] {
        const { status, search } = filter;

        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(t => t.status === status);
        }
        if (search) {
            tasks = tasks.filter(t => 
                t.title.includes(search)
                || t.description.includes(search)    
            )
        }

        return tasks;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): Task {
        const indx = this.tasks.findIndex(task => task.id === id);
        if (indx < 0) { return null; }
        const deletedTasks = this.tasks.splice(indx, 1);
        return deletedTasks.length > 0 ? deletedTasks[0] : null;
    }

    updateTaskById(updateTaskDto: UpdateTaskDto): Task {
        const { id, newStatus } = updateTaskDto;
        
        const task = this.tasks.find(task => task.id === id);

        if (task) {
            task.status = newStatus;
            return task;
        }
        
        return null;
    }

    updateTaskStatus(id: string, newStatus: TaskStatus): Task {
        const task = this.tasks.find(t => t.id === id);

        if (task) {
            task.status = newStatus;
        } else {
            throw new Error('Task not found.');
        }

        return task;
    }
}
