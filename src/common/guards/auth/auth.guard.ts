import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { SessionService } from "@module/common/session";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly sessionService: SessionService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization: authHeaderValue } = request.headers;

    if (!authHeaderValue) {
      throw new UnauthorizedException("No token provided");
    }

    const accessToken = authHeaderValue.includes("Bearer") ? authHeaderValue.split("Bearer ")[1] : authHeaderValue;
    try {
      const user = await this.sessionService.getUserFromToken(accessToken);
      request.user = user;
      return true;
    } catch (e) {
      const toThrow = new UnauthorizedException({
        statusCode: 401,
        category: "UNAUTHORIZED",
        message: "Token is not valid",
      });
      this.logger.error(e);
      throw toThrow;
    }
  }
}
