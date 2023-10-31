import { Module } from "@nestjs/common";

import { UsersModule } from "../users";

import { AuthController } from "./controllers";
import { AuthService } from "./services";

@Module({
  imports: [
    UsersModule,
  ],
  providers: [
    AuthService,
  ],
  controllers: [
    AuthController,
  ],
})
export class AuthModule {}
