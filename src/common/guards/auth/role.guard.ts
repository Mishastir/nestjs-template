import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "@module/common/decorators";
import { UserEntity } from "@module/modules/users/entities";

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (!user) {
      throw new Error("No `user` in request. Are you sure you put RoleGuard after AuthGuard?");
    }

    return requiredRoles.includes(user.role);
  }
}

