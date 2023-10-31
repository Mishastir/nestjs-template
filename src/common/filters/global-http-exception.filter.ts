import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";

import { IServiceExceptionCategory, ServiceException } from "../exceptions";

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);
  private readonly map: Map<number, IServiceExceptionCategory>;

  constructor() {
    this.map = new Map<number, IServiceExceptionCategory>([
      [403, "NOT_ALLOWED"],
      [404, "NOT_EXISTS"],
      [401, "NOT_ALLOWED"],
      [409, "ALREADY_EXISTS"],
      [500, "SYSTEM_INTERNAL"],
      [400, "VALIDATION"],
    ]);
  }

  private inspect(status: number): IServiceExceptionCategory {
    const category = this.map.get(status);
    if (!category) return "UNKNOWN";
    return category;
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { stack } = exception;
    const response = host.switchToHttp().getResponse<Response>();
    this.logger.error({ ...exception, stack, action: "end" });

    const httpError = exception.getResponse() as { statusCode: number; message: string[]; error: string };

    const { message, statusCode } = httpError;
    const category = this.inspect(statusCode);
    const error = new ServiceException(message.toString(), category, category, { ...httpError }, { cause: exception });
    this.logger.warn({ ...error, message: httpError.message.toString(), action: "end", stack });
    const status = statusCode;

    response.status(status).send({
      success: false,
      status,
      ...error.toJson({ withDetails: false }),
    });
  }
}
