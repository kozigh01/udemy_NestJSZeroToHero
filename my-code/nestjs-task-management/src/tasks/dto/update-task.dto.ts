import { TaskStatus } from "../task.model";

export class UpdateTaskDto {
    id: string;
    newStatus: TaskStatus;
}