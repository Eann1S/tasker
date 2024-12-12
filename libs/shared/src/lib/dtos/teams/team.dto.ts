import { ApiProperty } from "@nestjs/swagger";
import { TeamMemberDto } from "./team.member.dto";
import { TaskDto } from "../tasks/task.dto";

export class TeamDto {
    @ApiProperty()
    id!: string;
    
    @ApiProperty()
    name!: string;

    @ApiProperty()
    members?: TeamMemberDto[];

    @ApiProperty()
    tasks?: TaskDto[];
}