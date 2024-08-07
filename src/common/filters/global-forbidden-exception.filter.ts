import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException, Logger } from "@nestjs/common";
import { Response } from "express";

import { ServiceException } from "@module/common/exceptions";

@Catch(ForbiddenException)
export class GlobalForbiddenExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalForbiddenExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { stack } = exception;
    this.logger.error({ ...exception, stack, action: "end" });

    const error = new ServiceException("No access", "NO_PERMISSIONS", "NOT_ALLOWED", { ...exception }, { cause: exception });

    const status = 403;
    response.status(status).json({
      success: false,
      status,
      ...error.toJson({ withDetails: false }),
    });
  }
}
