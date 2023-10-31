import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { RoleGuard } from "./role.guard";

import { UserRole } from "@module/modules/users/enums";

const buildContext = (data: Record<string, unknown>): ExecutionContext => {
  const request = { ...data };

  return ({
    switchToHttp: () => ({
      getRequest: () => (request),
    }),
    getHandler: () => null,
    getClass: () => null,
  }) as ExecutionContext;
};

const defaultContext = buildContext({ user: { role: UserRole.USER } });
const contextWithoutUser = buildContext({});

describe("RoleGuard", () => {
  let reflector: Reflector;
  let roleGuard: RoleGuard;

  beforeEach(async () => {
    reflector = new Reflector();
    roleGuard = new RoleGuard(reflector);

    jest.resetAllMocks();
    reflector.getAllAndOverride = jest.fn().mockReturnValue([UserRole.USER]);
  });

  it("should be defined", () => {
    expect(roleGuard).toBeDefined();
  });

  it("should activate", async () => {
    const result = await roleGuard.canActivate(defaultContext);
    expect(result).toEqual(true);
  });

  it("should activate when no roles provided", async () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(undefined);

    const result = await roleGuard.canActivate(defaultContext);
    expect(result).toEqual(true);
  });

  it("should activate when empty roles array provided", async () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue([]);

    const result = await roleGuard.canActivate(defaultContext);
    expect(result).toEqual(true);
  });

  it("should throw error when no user in request", async () => {
    const result = roleGuard.canActivate(contextWithoutUser);

    await expect(result).rejects.toThrow(Error);
    await expect(result).rejects.toStrictEqual(new Error("No `user` in request. Are you sure you put RoleGuard after AuthGuard?"));
  });

  it("should throw error when user role is wrong", async () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue([UserRole.ADMIN]);
    const result = await roleGuard.canActivate(defaultContext);

    expect(result).toEqual(false);
  });

});
