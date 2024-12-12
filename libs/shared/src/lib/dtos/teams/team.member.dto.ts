import { ApiProperty } from '@nestjs/swagger';
import { TeamRole } from '@prisma/client';

export class TeamMemberDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  teamId!: string;

  @ApiProperty()
  role!: TeamRole;

  @ApiProperty()
  joinedAt!: Date;
}
