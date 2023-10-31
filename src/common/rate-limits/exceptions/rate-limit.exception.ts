import { HttpException } from "@nestjs/common";

type RateLimitDetails = { length: number; limit: number };

export class RateLimitException extends HttpException {
  constructor(details: RateLimitDetails) {
    super(
      {
        success: false,
        statusCode: 429,
        category: "TOO_MANY_REQUESTS",
        message: "Too Many Requests",
        code: "RATE_LIMITS",
        details,
      },
      429,
    );
  }
}
