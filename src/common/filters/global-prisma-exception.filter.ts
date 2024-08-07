import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Request } from "express";

import { ServiceException } from "../exceptions";

import { GlobalServiceExceptionFilter } from "./global-service-exception.filter";

@Catch(Prisma.PrismaClientKnownRequestError)
export class GlobalPrismaExceptionFilter extends BaseExceptionFilter {
  private readonly globalServiceExceptionFilter = new GlobalServiceExceptionFilter();

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    /* eslint-disable no-case-declarations */
    const args = host.switchToHttp().getRequest<Request>();

    switch (exception.code) {
      case "P2025":
        return this.globalServiceExceptionFilter.catch(
          new ServiceException(
            exception.message,
            "NOT_FOUND",
            "NOT_EXISTS",
          ),
          host,
        );

      case "P2016":
        return this.globalServiceExceptionFilter.catch(
          new ServiceException(
            "Cannot delete non-existing record",
            "FAILED_TO_DELETE",
            "VALIDATION",
          ),
          host,
        );

      case "P2002": {
        const { meta } = exception as Prisma.PrismaClientKnownRequestError;

        const message = `${meta.modelName} is duplicate by next fields: [${(meta.target as string[]).join(", ")}]`;

        return this.globalServiceExceptionFilter.catch(
          new ServiceException(
            message,
            "DUPLICATE",
            "ALREADY_EXISTS",
          ),
          host,
        );
      }

      case "P2003": {
        // eslint-disable-next-line default-case
        switch (args.method) {
          case "DELETE": {
            const { meta } = exception as Prisma.PrismaClientKnownRequestError;

            const message = `${meta.modelName} cannot be deleted, check the data associated with it.`;
    
            return this.globalServiceExceptionFilter.catch(
              new ServiceException(
                message,
                "CANNOT_BE_DELETED",
                "VALIDATION",
              ),
              host,
            );
          }

          default: {
            return this.globalServiceExceptionFilter.catch(
              new ServiceException(
                exception.message,
                "INTERNAL_ERROR",
                "SYSTEM_INTERNAL",
              ),
              host,
            );
          }
        }
      }

      default:
        return this.globalServiceExceptionFilter.catch(
          new ServiceException(
            exception.message,
            "INTERNAL_ERROR",
            "SYSTEM_INTERNAL",
          ),
          host,
        );
    }
  }
}
