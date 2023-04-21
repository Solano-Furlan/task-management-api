import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/entities/user.enitity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  async updateClassStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.getTaskById(id, user);
    return this.tasksRepository.updateClassStatus(task, updateTaskStatusDto);
  }

  deleteTask(id: string, user: User): Promise<void> {
    return this.tasksRepository.deleteTask(id, user);
  }
}
