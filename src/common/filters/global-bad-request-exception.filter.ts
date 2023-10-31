import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";

import { ServiceException } from "@module/common/exceptions";

@Catch(BadRequestException)
export class GlobalBadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalBadRequestExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { stack } = exception;

    const httpError = exception.getResponse() as { statusCode: number; message: string[]; error: string };
    const { message } = httpError;
    const error = new ServiceException(
      message.toString(),
      "VALIDATION",
      "VALIDATION",
      { ...httpError.message },
      { cause: exception },
    );
    this.logger.warn({ ...error, message: httpError.message.toString(), action: "end", stack });

    const status = 400;
    response.status(status).json({
      success: false,
      status,
      ...error.toJson({ withDetails: true }),
    });
  }
}
