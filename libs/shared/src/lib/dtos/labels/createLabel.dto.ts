import { OmitType } from "@nestjs/swagger";
import { LabelDto } from "./label.dto";

export class CreateLabelDto extends OmitType(LabelDto, ['id'] as const) {}