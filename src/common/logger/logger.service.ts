import { join } from "path";

import { Inject, Injectable, LoggerService as NestjsLoggerInterface } from "@nestjs/common";
import { P, pino } from "pino";

import { NestJsLoggerAdapter } from "./nestjs-adapter";

import { AsyncContext, CONTEXT_ALS } from "@module/common/context";
import { ConfigService } from "@module/config";

@Injectable()
export class LoggerService {
  private readonly pino: P.Logger;

  constructor(config: ConfigService, @Inject(CONTEXT_ALS) private readonly asyncContext: AsyncContext) {
    const { logLevel, prettyPrint } = config.logger;
    const { name, version } = config.app;
    const level = logLevel || "info";

    this.pino = pino({
      level,
      messageKey: "message",
      base: { service: { name, version } },
      mixin: () => {
        const store = this.asyncContext?.getStore();
        if (!store) return { debug: {} };
        const trace = store.get("trace");
        const protocol = store.get("protocol");
        const event = store.get("event");
        const ip = store.get("ip");

        const debug = { trace, protocol, event, ip };
        return { debug };
      },
      transport: prettyPrint && { target: join(__dirname, "pino-pretty.logger-transport") },
    });
  }

  public getNestjsAdapter(): NestjsLoggerInterface {
    return new NestJsLoggerAdapter(this.pino);
  }
}
