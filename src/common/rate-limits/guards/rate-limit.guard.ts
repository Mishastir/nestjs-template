import { createHash } from "node:crypto";

import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerStorage } from "@nestjs/throttler";
import { ThrottlerRequest } from "@nestjs/throttler/dist/throttler.guard.interface";
import { Response } from "express";

import { RateLimitException } from "../exceptions";

import { AsyncContext, CONTEXT_ALS } from "@module/common/context";

// TODO: Was not tested after breaking change in @nestjs/throttler package
@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected headerPrefix = "X-RateLimit";

  constructor(
    options: ThrottlerModuleOptions,
    storage: ThrottlerStorage,
    reflector: Reflector,
    @Inject(CONTEXT_ALS) private readonly als: AsyncContext,
  ) {
    super(options, storage, reflector);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handleRequest(request: ThrottlerRequest): Promise<boolean> {
    const { context, limit, ttl } = request;

    const store = this.als.getStore();
    const response = context.switchToHttp().getResponse<Response>();
    const ip = store.get("ip");

    const key = this.generateKey(context, ip);
    const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl, limit, 0, "default");
    if (totalHits >= limit) {
      const toThrow = new RateLimitException({ length: totalHits, limit });

      response.header("Retry-After", timeToExpire.toString());
      // this.logger.warn(toThrow);

      throw toThrow;
    }
    response.header(`${this.headerPrefix}-Limit`, limit.toString());
    response.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - totalHits).toString());
    response.header(`${this.headerPrefix}-Reset`, timeToExpire.toString());

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  generateKey(context: ExecutionContext, suffix: string): string {
    // library use npm package for md5 generate...
    const prefix = `${context.getClass().name}-${context.getHandler().name}`;
    return createHash("md5").update(`${prefix}-${suffix}`).digest("hex");
  }
}
