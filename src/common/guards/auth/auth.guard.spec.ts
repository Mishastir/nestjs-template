import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "./auth.guard";

import { ServiceException } from "@module/common/exceptions";
import { SessionService } from "@module/common/session";

const buildContext = (headers: Record<string, unknown>): ExecutionContext => {
  const request = { headers };

  return ({
    switchToHttp: () => ({
      getRequest: () => (request),
    }),
  }) as ExecutionContext;
};

const noTokenContext = buildContext({});
const invalidTokenContext = buildContext({ authorization: "Bearer wrong token" });
const validTokenContext = buildContext({ authorization: "Bearer token" });

describe("AuthGuard", () => {
  let sessionService: SessionService;
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SessionService,
          useValue: {
            getUserFromToken: (token: string) => {
              if (token === "token") {
                return { name: "username" };
              }

              throw new Error("Invalid token");
            },
          },
        },
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
    authGuard = new AuthGuard(sessionService);
  });

  it("should be defined", () => {
    expect(authGuard).toBeDefined();
  });

  it("should validate", async () => {
    const request = validTokenContext.switchToHttp().getRequest();

    const result = await authGuard.canActivate(validTokenContext);
    expect(request).toHaveProperty("user");
    expect(result).toEqual(true);
  });

  it("should throw error when no token provided", async () => {
    const result = authGuard.canActivate(noTokenContext);

    await expect(result).rejects.toThrow(UnauthorizedException);
    await expect(result).rejects.toStrictEqual(new UnauthorizedException("No token provided"));
  });

  it("should throw error when token is invalid", async () => {
    const result = authGuard.canActivate(invalidTokenContext);

    await expect(result).rejects.toThrow(ServiceException);
    await expect(result).rejects.toStrictEqual(new ServiceException("Token is not valid", "UNAUTHORIZED", "UNAUTHORIZED"));
  });
});
