import { ApiProperty } from "@nestjs/swagger";

export class UserSessionDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresAt: number;

  @ApiProperty()
  accessTokenTtl: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpiresAt: number;

  @ApiProperty()
  refreshTokenTtl: number;
}
