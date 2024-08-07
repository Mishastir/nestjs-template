import { MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";

import { ConfigModule } from "@config";
import { DatabaseModule } from "@database";
import { AssetsModule } from "@module/common/assets";
import { ContextModule, HttpContextMiddleware } from "@module/common/context";
import {
  GlobalAnyExceptionFilter,
  GlobalBadRequestExceptionFilter,
  GlobalForbiddenExceptionFilter,
  GlobalHttpExceptionFilter,
  GlobalPrismaExceptionFilter,
  GlobalServiceExceptionFilter,
} from "@module/common/filters";
import { HttpLoggerMiddleware, LoggerModule } from "@module/common/logger";
import { SessionModule } from "@module/common/session";
import { AuthModule } from "@module/modules/auth";
import { UsersModule } from "@module/modules/users";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    SessionModule,
    UsersModule,
    AssetsModule,
    ConfigModule,
    LoggerModule,
    ContextModule,
    ThrottlerModule.forRoot([
      // Default rate limit. Works only when route using @RateLimit()
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalAnyExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalBadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalHttpExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalPrismaExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalServiceExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalForbiddenExceptionFilter },
  ],
})
export class AppModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer): void {
    // (.*) is for fastify
    consumer.apply(HttpContextMiddleware).forRoutes("*").apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
