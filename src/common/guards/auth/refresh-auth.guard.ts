import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { SessionService } from "@module/common/session";

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  private readonly logger = new Logger(RefreshAuthGuard.name);

  constructor(
    private readonly sessionService: SessionService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshTokenHeaderValue = request.headers["refresh-token"];

    if (!refreshTokenHeaderValue) {
      throw new UnauthorizedException("No token provided");
    }

    const refreshToken = refreshTokenHeaderValue.includes("Bearer") ? refreshTokenHeaderValue.split("Bearer ")[1] : refreshTokenHeaderValue;
    try {
      const user = await this.sessionService.getUserFromToken(refreshToken);
      request.user = user;
      return true;
    } catch (e) {
      const toThrow = new UnauthorizedException({
        statusCode: 401,
        category: "UNAUTHORIZED",
        message: "Token is not valid",
      });
      this.logger.error(toThrow);
      throw toThrow;
    }
  }
}
