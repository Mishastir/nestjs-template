import { Global, Module } from "@nestjs/common";

import { contextALSProvider } from "./als.provider";
import { CONTEXT_ALS } from "./als.token";

@Global()
@Module({
  providers: [contextALSProvider],
  exports: [CONTEXT_ALS],
})
export class ContextModule {}
