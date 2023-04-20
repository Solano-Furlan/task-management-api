import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class GetTasksFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly status?: TaskStatus;

  @IsOptional()
  @IsString()
  readonly search?: string;
}
