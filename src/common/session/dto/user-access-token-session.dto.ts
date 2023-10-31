import { ApiProperty } from "@nestjs/swagger";

export class UserAccessTokenSessionDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresAt: number;

  @ApiProperty()
  accessTokenTtl: number;
}
