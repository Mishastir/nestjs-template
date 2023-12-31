import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "ROLES";
export const Roles = (...roles: string[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);
