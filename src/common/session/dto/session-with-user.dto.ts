import { ApiProperty } from "@nestjs/swagger";

import { UserSessionDto } from "./user-session.dto";

import { UserModel } from "@module/modules/users/models";

export class SessionWithUserDto extends UserSessionDto {
  @ApiProperty({ type: () => UserModel })
  user: UserModel;
}
