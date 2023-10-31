import { MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AssetsModule } from "./common/assets";
import { ContextModule, HttpContextMiddleware } from "./common/context";
import {
  GlobalAnyExceptionFilter,
  GlobalBadRequestExceptionFilter,
  GlobalHttpExceptionFilter,
  GlobalServiceExceptionFilter,
} from "./common/filters";
import { HttpLoggerMiddleware, LoggerModule } from "./common/logger";
import { SessionModule } from "./common/session";
import { ConfigModule } from "./config";
import { rootDbConfig } from "./database";
import { AuthModule } from "./modules/auth";
import { UsersModule } from "./modules/users";

@Module({
  imports: [
    AuthModule,
    SessionModule,
    UsersModule,
    AssetsModule,
    ConfigModule,
    LoggerModule,
    ContextModule,
    TypeOrmModule.forRootAsync(rootDbConfig),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== "production",
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: GlobalAnyExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalBadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalHttpExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalServiceExceptionFilter },
  ],
})
export class AppModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer): void {
    // (.*) is for fastify
    consumer.apply(HttpContextMiddleware).forRoutes("*").apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
