import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = { id: 1234, username: 'Test User' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: Partial<TaskRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      
      (taskRepository.getTasks as jest.Mock).mockResolvedValue('some value');
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'some search query' };
      const result = await tasksService.getTasks(filters, mockUser as User);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and retrieve/return the task', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();

      (taskRepository.findOne as jest.Mock).mockResolvedValue({ title: 'title 1', description: 'description 1' });
      const result = tasksService.getTaskById(1, mockUser as User);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id
        }
      });
      expect((await result).title).toEqual('title 1')
      expect((await result).description).toEqual('description 1')
    });

    it('throws and error if task is not found', () => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const newTask = new Task();
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      (taskRepository.createTask as jest.Mock).mockResolvedValue(newTask);
      const createTaskDto: CreateTaskDto = { title: 'title 1', description: 'description 1'};
      const result = await tasksService.createTask(createTaskDto, mockUser as User);

      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(newTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task when task is found', async () => {
      expect(taskRepository.delete).not.toHaveBeenCalled();

      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      const result = await tasksService.deleteTaskById(123, mockUser as User);

      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 123, userId: mockUser.id });
    });

    it('should throw a NotFoundException when task id is not found', async () => {
      expect(taskRepository.delete).not.toHaveBeenCalled();

      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTaskById(123, mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('should save the new status and return modified task', async () => {
      const task = { status: TaskStatus.OPEN, save: jest.fn() };
      tasksService.getTaskById = jest.fn().mockResolvedValue(task);

      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(123, TaskStatus.DONE, mockUser as User);

      expect(tasksService.getTaskById).toHaveBeenCalledWith(123, mockUser);
      expect(result.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});