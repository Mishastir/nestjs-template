import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { Roles } from "./roles.decorator";

import { AuthGuard, RoleGuard } from "@module/common/guards";

export const WithAuth = (...roles: string[]) => (
    applyDecorators(
      Roles(...roles),
      UseGuards(AuthGuard, RoleGuard),
      ApiBearerAuth("Auth"),
      ApiUnauthorizedResponse({ description: "Unauthorized" }),
    )
  );
