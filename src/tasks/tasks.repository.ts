import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.enitity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepository: Repository<Task>,
  ) {}

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search }: GetTasksFilterDto = getTasksFilterDto;

    const query: SelectQueryBuilder<Task> =
      this.taskEntityRepository.createQueryBuilder('task');

    query.where({ user: user });

    if (status) {
      query.andWhere('task.status = :statusValue', { statusValue: status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :searchValue OR LOWER(task.description) LIKE :searchValue)',
        { searchValue: `%${search.toLowerCase()}%` },
      );
    }

    const tasks: Task[] = await query.getMany();

    return tasks;
  }

  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskEntityRepository.findOneBy({ id: id, user: user });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description }: CreateTaskDto = createTaskDto;

    const task: Task = this.taskEntityRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });

    await this.taskEntityRepository.save(task);
    return task;
  }

  async updateClassStatus(
    task: Task,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status }: UpdateTaskStatusDto = updateTaskStatusDto;
    task.status = status;
    await this.taskEntityRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleteResult: DeleteResult = await this.taskEntityRepository.delete({
      id: id,
      user: user,
    });
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Failed to delete. Task with ID: ${id} not found`,
      );
    }
  }
}
