import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { LoggerService } from "./common/logger";
import { ConfigService } from "./config";

async function bootstrap(): Promise<void> {
  const config = new ConfigService();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const logger = app.get<LoggerService>(LoggerService);

  app.enableCors({ origin: config.app.corsUrls });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useLogger(logger.getNestjsAdapter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("--service_name---Backend API")
    .setVersion("1.0.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "Header" }, "Auth")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = config.app.port;

  await app.listen(port)
    .then(() => {
      logger.getNestjsAdapter().log(`Server(${config.app.env}) initialized on port ${port}`);
    });
}

bootstrap();
