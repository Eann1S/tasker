import { PickType } from "@nestjs/swagger";
import { LabelDto } from "./label.dto";

export class CreateLabelDto extends PickType(LabelDto, ['name'] as const) {}