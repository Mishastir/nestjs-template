import { randomUUID } from "crypto";
import { ServerResponse } from "http";

import { Inject, NestMiddleware } from "@nestjs/common";
import { Request } from "express";


import { CONTEXT_ALS } from "./als.token";
import { AsyncContext, ContextMap } from "./context.type";

type CustomRequest = Request & { originalUrl: string };

export class HttpContextMiddleware implements NestMiddleware {
  constructor(@Inject(CONTEXT_ALS) private readonly context: AsyncContext) {}

  public async use(request: CustomRequest, response: ServerResponse, next: () => void): Promise<void> {
    const map: ContextMap = new Map();

    const { "x-request-id": requestId, "x-real-ip": ipHeader } = request.headers;
    const { originalUrl: url, method } = request;

    const trace = requestId?.toString() || randomUUID();
    const ip = ipHeader?.toString() || null;

    const protocol = "http";
    const event = `${method} ${url}`;

    map.set("trace", trace).set("ip", ip).set("protocol", protocol).set("event", event);

    this.context.run(map, () => {
      response.setHeader("trace", trace);
      next();
    });
  }
}
