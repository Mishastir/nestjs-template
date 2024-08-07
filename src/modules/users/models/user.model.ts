import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { UserRole } from "../enums";


export class UserModel implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
