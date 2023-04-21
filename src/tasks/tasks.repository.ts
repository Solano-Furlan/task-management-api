import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search }: GetTasksFilterDto = getTasksFilterDto;

    const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :statusValue', { statusValue: status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :searchValue OR LOWER(task.description) LIKE :searchValue',
        { searchValue: `%${search.toLowerCase()}%` },
      );
    }

    const tasks: Task[] = await query.getMany();

    return tasks;
  }

  getTaskById(id: string): Promise<Task> {
    return this.findOneBy({ id: id });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description }: CreateTaskDto = createTaskDto;

    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async updateClassStatus(
    task: Task,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status }: UpdateTaskStatusDto = updateTaskStatusDto;
    task.status = status;
    await this.save(task);
    return task;
  }

  deleteTask(id: string): Promise<DeleteResult> {
    return this.delete({ id: id });
  }
}
