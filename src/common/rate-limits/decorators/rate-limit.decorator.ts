import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiTooManyRequestsResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import { RateLimitGuard } from "../guards";

type RateLimitOptions = { limit: number; ttl?: number };
/**
 * @param opt RateLimitOptions interface. limit - how much endpoint before block, ttl - how much time in seconds will be blocked
 * @returns
 */
export const RateLimit = (opt: RateLimitOptions) => (
  applyDecorators(
    UseGuards(RateLimitGuard),
    Throttle({ default: opt }),
    ApiTooManyRequestsResponse({
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          status: { type: "number", example: 429 },
          category: { type: "string", example: "TOO_MANY_REQUESTS" },
          code: { type: "string", example: "TOO_MANY_REQUESTS" },
          message: { type: "string", example: "Too Many Requests" },
          details: {
            type: "object",
            properties: {
              length: { type: "number" },
              limit: { type: "number" },
            },
          },
        },
      },
    }),
  ));
