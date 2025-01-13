import { ApiProperty } from "@nestjs/swagger";
import { TeamMemberDto } from "./team.member.dto";
import { TaskDto } from "../tasks/task.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class TeamDto {
    @ApiProperty()
    id!: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    members?: TeamMemberDto[];

    @ApiProperty()
    tasks?: TaskDto[];
}