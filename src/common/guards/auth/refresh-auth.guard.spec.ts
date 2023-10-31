import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { RefreshAuthGuard } from "./refresh-auth.guard";

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
const invalidTokenContext = buildContext({ "refresh-token": "Bearer wrong token" });
const validTokenContext = buildContext({ "refresh-token": "Bearer token" });

describe("RefreshAuthGuard", () => {
  let sessionService: SessionService;
  let refreshAuthGuard: RefreshAuthGuard;

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
    refreshAuthGuard = new RefreshAuthGuard(sessionService);
  });

  it("should be defined", () => {
    expect(refreshAuthGuard).toBeDefined();
  });

  it("should validate", async () => {
    const request = validTokenContext.switchToHttp().getRequest();

    const result = await refreshAuthGuard.canActivate(validTokenContext);
    expect(request).toHaveProperty("user");
    expect(result).toEqual(true);
  });

  it("should throw error when no token provided", async () => {
    const result = refreshAuthGuard.canActivate(noTokenContext);

    await expect(result).rejects.toThrow(UnauthorizedException);
    await expect(result).rejects.toStrictEqual(new UnauthorizedException("No token provided"));
  });

  it("should throw error when token is invalid", async () => {
    const result = refreshAuthGuard.canActivate(invalidTokenContext);

    await expect(result).rejects.toThrow(UnauthorizedException);
    await expect(result).rejects.toStrictEqual(new UnauthorizedException({
      statusCode: 401,
      category: "UNAUTHORIZED",
      message: "Token is not valid",
    }));
  });
});
