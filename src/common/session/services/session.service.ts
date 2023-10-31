import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserSessionDto, UserSessionDto } from "../dto";
import { AccessTokenPayload, RefreshTokenPayload } from "../types";

import { JwtService } from "./jwt.service";

import { ConfigService } from "@module/config";
import { UserEntity } from "@module/modules/users/entities";

@Injectable()
export class SessionService {
  private readonly jwtAccessTokenService: JwtService<AccessTokenPayload>;
  private readonly jwtRefreshTokenService: JwtService<RefreshTokenPayload>;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
  ) {
    this.jwtAccessTokenService = new JwtService({
      privateKey: this.configService.jwt.privateKey,
      publicKey: this.configService.jwt.publicKey,
      ttlInSeconds: this.configService.jwt.accessTtl,
    });

    this.jwtRefreshTokenService = new JwtService({
      privateKey: this.configService.jwt.privateKey,
      publicKey: this.configService.jwt.publicKey,
      ttlInSeconds: this.configService.jwt.refreshTtl,
    });
  }

  async getUserFromToken(token: string): Promise<UserEntity> {
    const { userId } = await this.getTokenPayload(token);

    const user = await this.userModel.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
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
