import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserBody {
  @ApiProperty({ default: "mail@mail.com" })
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
