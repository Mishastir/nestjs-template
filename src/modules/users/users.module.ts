import { Module } from "@nestjs/common";

import { UsersController } from "./controllers";
import { UsersService } from "./services";

@Module({
  providers: [
    UsersService,
  ],
  exports: [
    UsersService,
  ],
  controllers: [
    UsersController,
  ],
})
export class UsersModule {}
