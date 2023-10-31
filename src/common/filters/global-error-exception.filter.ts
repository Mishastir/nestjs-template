import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";

import { ServiceException } from "@module/common/exceptions";

@Catch()
export class GlobalAnyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalAnyExceptionFilter.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost): void {
    const { stack } = exception;
    const response = host.switchToHttp().getResponse<Response>();
    this.logger.error({ ...exception, stack, action: "end" });
    const error = new ServiceException(
      "Internal error",
      "UNKNOWN",
      "SYSTEM_INTERNAL",
      { ...exception },
      { cause: exception },
    );
    const status = 500;
    response.status(status).json({
      success: false,
      status,
      ...error.toJson({ withDetails: false }),
    });
  }
}
