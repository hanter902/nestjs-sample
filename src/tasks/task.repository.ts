import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTaskFilterDto } from "./dto/get-tasks-filter-dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title like :search or task.description like :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.DONE;
        await task.save();

        return task;
    }
}