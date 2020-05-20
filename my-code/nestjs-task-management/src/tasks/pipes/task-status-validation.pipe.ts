import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        const valid = Object.values(TaskStatus).includes(value);
        if (!valid) {
            throw new BadRequestException(`Status '${value}' is not a valid TaskStatus value.`);
        }


        return value;
    }
}