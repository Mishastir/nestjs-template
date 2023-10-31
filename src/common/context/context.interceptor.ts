/* eslint-disable class-methods-use-this */
import { randomUUID } from "crypto";

import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { CONTEXT_ALS } from "./als.token";
import type { AsyncContext, ContextMap } from "./context.type";

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(@Inject(CONTEXT_ALS) private readonly als: AsyncContext) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { args } = context.switchToRpc().getContext<{ args: string[] }>();
    const incomingData = context.switchToRpc().getData();

    const trace = incomingData?.trace || randomUUID();
    const protocol = "rpc";
    const [event] = args;

    const map: ContextMap = new Map();

    map.set("trace", trace).set("protocol", protocol).set("event", event);
    // Uncomment IP assign for gateway
    // .set("ip", "")

    this.als.enterWith(map);

    return next.handle();
  }
}
