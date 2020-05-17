import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const valid = Object.values(TaskStatus).includes(value);
        if (!valid) {
            throw new BadRequestException();
        }

        value = value.tosString().toUpperCase();

        return value;
    }
}