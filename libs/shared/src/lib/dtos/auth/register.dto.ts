import { ApiProperty } from "@nestjs/swagger";
import { LoginDto } from "./login.dto";
import { IsNotEmpty } from "class-validator";

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @ApiProperty()
  username!: string;
}
