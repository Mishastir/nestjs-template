import { ApiProperty } from "@nestjs/swagger";

import { UserSessionDto } from "./index";

import { UserEntity } from "@module/modules/users/entities";

export class SessionWithUserDto extends UserSessionDto {
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
}
