import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "@module/common/decorators/auth/roles.decorator";
import { UserRole } from "@module/modules/users/enums";
import { UserModel } from "@module/modules/users/models";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: UserModel = request.user;

    if (!user) {
      throw new Error(`No 'user' in request. Are you sure you put ${RoleGuard.name} after AuthGuard?`);
    }

    return requiredRoles.includes(user.role);
  }
}

