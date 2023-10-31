import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Response } from "express";

import { IServiceExceptionCategory, ServiceException } from "@module/common/exceptions";

@Catch(ServiceException)
export class GlobalServiceExceptionFilter implements ExceptionFilter {
  private readonly map: Map<IServiceExceptionCategory, (message: string) => HttpException>;

  constructor() {
    this.map = new Map<IServiceExceptionCategory, (message: string) => HttpException>([
      ["ALREADY_EXISTS", (message) => new ConflictException(message)],
      ["NOT_ALLOWED", (message) => new ForbiddenException(message)],
      ["NOT_EXISTS", (message) => new NotFoundException(message)],
      ["VALIDATION", (message) => new BadRequestException(message)],
      ["EXTERNAL_API", (message) => new UnprocessableEntityException(message)],
      ["UNKNOWN", () => new InternalServerErrorException("Internal error")],
    ]);
  }

  private readonly logger = new Logger(GlobalServiceExceptionFilter.name);

  private getCategory(category: IServiceExceptionCategory, message: string): HttpException {
    const error = this.map.get(category);
    if (!error) {
      return new InternalServerErrorException("unknown error");
    }

    return error(message);
  }

  catch(exception: ServiceException<never>, host: ArgumentsHost): void {
    const { stack, category, message } = exception;
    const response = host.switchToHttp().getResponse<Response>();
    this.logger.error({ ...exception, stack, action: "end" });
    const httpError = this.getCategory(category, message);
    const status = httpError.getStatus();
    response
      .status(httpError.getStatus())
      .json({
        success: false,
        status,
        ...exception.toJson({ withDetails: true }),
      })
      .end();
  }
}
