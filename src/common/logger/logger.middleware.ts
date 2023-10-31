import { ServerResponse } from "http";
import { hrtime } from "process";

import { Logger, NestMiddleware } from "@nestjs/common";
import { Request } from "express";

type CustomRequest = Request & { originalUrl: string };
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("http");

  private readonly finishResponseHandlers = new Map([
    [100, this.successLog.bind(this)],
    [200, this.successLog.bind(this)],
    [300, this.successLog.bind(this)],
    [400, this.warnLog.bind(this)],
    [500, this.errorLog.bind(this)],
  ]);

  public async use(request: CustomRequest, response: ServerResponse, next: () => void): Promise<void> {
    const start = hrtime.bigint();
    new Date().getTime();
    const { "content-type": contentType, "content-length": contentLength } = request.headers;
    const { method, originalUrl: url } = request;

    this.logger.log({ contentType, contentLength, method, url, message: url, action: "start" });
    response.on("finish", () => {
      const end = hrtime.bigint();
      const nanos = end - start;
      const { statusCode } = response;

      const group = +statusCode.toString()[0] * 100;

      const handler = this.finishResponseHandlers.get(group) || this.finishResponseHandlers.get(500);

      handler({
        nanos,
        statusCode,
        contentType,
        contentLength,
        method,
        url,
        message: url,
        action: "end",
      });
    });
    next();
  }

  private successLog(obj: Record<string, string | number>): void {
    this.logger.log(obj);
  }
  private warnLog(obj: Record<string, string | number>): void {
    this.logger.warn(obj);
  }
  private errorLog(obj: Record<string, string | number>): void {
    this.logger.error(obj);
  }
}
