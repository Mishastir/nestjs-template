/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from "@nestjs/common";
import { P } from "pino";

type PinoLogger = Pick<P.Logger, "info" | "debug" | "trace" | "error" | "warn">;

/**
 * The logger should provide interface for different types of message
 * - Developer wants to log only string
 * - Developer wants to log only object
 * - Developer wants to log both (obj, message) OR ({message, ...obj})
 * - Developer wants to log Error type (logger.error(...))
 */
export class NestJsLoggerAdapter implements LoggerService {
  private readonly contextName: string = "NoContext";
  private readonly map = new Map([
    ["data", NestJsLoggerAdapter.mapSuccessMessage],
    ["err", NestJsLoggerAdapter.mapErrorMessage],
  ]);

  constructor(protected readonly logger: PinoLogger) {}

  verbose(log: any, context?: string): void {
    const { message, obj } = this.prepare("data", log, context);
    this.logger.trace(obj, message);
  }

  debug(log: any, context?: string): void {
    const { message, obj } = this.prepare("data", log, context);
    this.logger.debug(obj, message);
  }

  log(log: any, context?: string): void {
    const { message, obj } = this.prepare("data", log, context);
    this.logger.info(obj, message);
  }

  warn(log: any, context?: string): void {
    const { message, obj } = this.prepare("data", log, context);
    this.logger.warn(obj, message);
  }

  error(log: any, _trace?: string, context?: string): void {
    const { message, obj } = this.prepare("err", log, context);
    this.logger.error(obj, message);
  }

  private prepare(type: "data" | "err", log: any, context?: string): { message: string; obj: Record<string, unknown> } {
    const ctx = context || this.contextName;

    const [record, msg] = this.map.get(type)(log);

    return { obj: { ctx, ...record }, message: msg || ctx || "empty" };
  }

  private static mapSuccessMessage(record: any): [Record<string, unknown>, string] {
    const isObject = typeof record === "object";

    if (!record) {
      return [{ data: {} }, null];
    }

    if (isObject) {
      const { message, ...obj } = record;
      return [{ data: { ...obj } }, message || null];
    }
    return [{ data: {} }, record];
  }

  private static mapErrorMessage(record: any): [Record<string, unknown>, string] {
    const isObject = typeof record === "object";

    if (!record) {
      return [{ err: {} }, "error"];
    }

    if (isObject) {
      const isErrorInstance = record instanceof Error;
      if (isErrorInstance) {
        const { message, name, stack, ...obj } = record as Error;

        return [{ err: { message, name, stack, ...obj } }, message || "error"];
      }
      const { message } = record;
      return [{ err: { ...record } }, message || "error"];
    }

    return [{ err: {} }, record];
  }
}
