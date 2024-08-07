import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { UserRole } from "../enums";

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole;

  @ApiProperty()
  password: string;
}
