import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/swagger"
import { TaskDto } from "./task.dto"

export class CreateTaskDto extends IntersectionType(
    PickType(TaskDto, ['title', 'creatorId']  as const),
    PartialType(OmitType(TaskDto, ['id', 'title', 'creatorId', 'createdAt', 'updatedAt']  as const)),
) {
}