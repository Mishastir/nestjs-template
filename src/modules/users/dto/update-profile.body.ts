import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";

export class UpdateProfileBody {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
