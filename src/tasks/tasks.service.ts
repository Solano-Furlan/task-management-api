import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(getTasksFilterDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  async updateClassStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task: Task = await this.getTaskById(id);
    return this.tasksRepository.updateClassStatus(task, updateTaskStatusDto);
  }

  async deleteTask(id: string): Promise<void> {
    const deleteResult = await this.tasksRepository.deleteTask(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Failed to delete. Task with ID: ${id} not found`,
      );
    }
  }
}
