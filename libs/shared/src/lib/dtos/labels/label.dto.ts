import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LabelDto {
    @ApiProperty()
    id!: string;

    @IsNotEmpty()
    @ApiProperty()
    name!: string;
}