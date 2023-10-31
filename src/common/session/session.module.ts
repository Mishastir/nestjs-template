import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionService } from "./services";

import { UserEntity } from "@module/modules/users/entities";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
