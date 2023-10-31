import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "./controllers";
import { UserEntity } from "./entities";
import { UsersService } from "./services";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],
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
