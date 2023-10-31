/* eslint-disable class-methods-use-this */
import { hrtime } from "process";

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class LoggerRpcInterceptor implements NestInterceptor {
  private readonly logger = new Logger("rpc");
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = hrtime.bigint();
    const { args } = context.switchToRpc().getContext();

    const [event] = args;

    this.logger.log({ action: "start", message: event });
    return next.handle().pipe(
      tap(() => this.logger.log({ action: "end", message: event, nanos: hrtime.bigint() - start })),
      catchError((err: Error) => throwError(() => err)),
    );
  }
}
