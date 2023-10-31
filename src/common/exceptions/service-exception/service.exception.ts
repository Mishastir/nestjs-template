import { HttpException } from "@nestjs/common";

import { IServiceExceptionCategory } from "./exception-category.type";
import { IServiceException } from "./service-exception.interface";

export type BaseDetails = Record<string, unknown>;

export class ServiceException<T = BaseDetails> extends Error implements IServiceException<T> {
  public category: IServiceExceptionCategory = "UNKNOWN";
  public code: string = "UNKNOWN";
  public details: T;

  constructor(
    message: string | Record<string, string>,
    code?: string, // is it necessary field?
    category?: IServiceExceptionCategory,
    details?: T,
    options?: { cause?: ErrorOptions },
  ) {
    super(message as string);

    this.category = category || "UNKNOWN";
    this.code = code || "UNKNOWN";
    this.details = details || null;
    this.cause = options?.cause;
  }

  static fromHttpException(error: HttpException, details?: Record<string, unknown>): ServiceException<BaseDetails> {
    const statusText = details?.statusText;

    const code = (statusText as string)?.replace(/\s+/g, "_").toUpperCase();
    return new ServiceException(
      error.message,
      code,
      "EXTERNAL_API",
      {
        status: error.getStatus(),
        ...details,
        ...(error.getResponse() as object),
      },
      { cause: error.cause },
    );
  }

  toJson(options?: { withDetails: boolean }): Record<string, unknown> {
    return {
      message: this.message,
      code: this.code,
      category: this.category,
      details: options?.withDetails ? this.details : {},
    };
  }
}
