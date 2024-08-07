import { Global, Module } from "@nestjs/common";

import { SessionService } from "./services";

@Global()
@Module({
  imports: [],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
