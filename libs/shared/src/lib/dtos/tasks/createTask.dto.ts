import { ApiPropertyOptional, IntersectionType, PartialType, PickType } from "@nestjs/swagger"
import { TaskDto } from "./task.dto"

export class CreateTaskDto extends IntersectionType(
    PickType(TaskDto, ['title']  as const),
    PartialType(PickType(TaskDto, ['description', 'dueDate', 'priority', 'status']  as const)),
) {

    @ApiPropertyOptional()
    assigneeId?: string;

    @ApiPropertyOptional()
    teamId?: string
}