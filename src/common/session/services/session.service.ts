import { Injectable, NotAcceptableException } from "@nestjs/common";

import { CreateUserSessionDto, UserSessionDto } from "../dto";
import { AccessTokenPayload, RefreshTokenPayload } from "../types";

import { JwtService } from "./jwt.service";

import { ConfigService } from "@config";
import { PrismaService } from "@database";
import { UserModel } from "@module/modules/users/models";

@Injectable()
export class SessionService {
  private readonly jwtAccessTokenService: JwtService<AccessTokenPayload>;
  private readonly jwtRefreshTokenService: JwtService<RefreshTokenPayload>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.jwtAccessTokenService = new JwtService({
      privateKey: this.configService.jwt.privateKey,
      publicKey: this.configService.jwt.publicKey,
      ttlInSeconds: this.configService.jwt.accessTtl,
    });

    // TODO: Access and refresh should have different keys
    this.jwtRefreshTokenService = new JwtService({
      privateKey: this.configService.jwt.privateKey,
      publicKey: this.configService.jwt.publicKey,
      ttlInSeconds: this.configService.jwt.refreshTtl,
    });
  }

  async getUserFromToken(token: string): Promise<UserModel> {
    const { userId } = await this.getTokenPayload(token);

    return await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
    }) as UserModel;
  }

  async createUserSession(data: CreateUserSessionDto): Promise<UserSessionDto> {
    const {
      token: accessToken,
      expiresAt: accessTokenExpiresAt,
      life: accessTokenTtl,
    } = await this.jwtAccessTokenService.sign(data);

    const {
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      life: refreshTokenTtl,
    } = await this.jwtRefreshTokenService.sign(data);

    return ({
      userId: data.userId,
      accessToken,
      accessTokenTtl,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenTtl,
      refreshTokenExpiresAt,
    });
  }

  private async getTokenPayload(token: string): Promise<AccessTokenPayload> {
    const { isValid, payload } = await this.jwtAccessTokenService.verify(token);

    if (!isValid) {
      throw new NotAcceptableException("Token is invalid or expired");
    }

    return payload;
  }
}
