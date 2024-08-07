import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";

import { httpClientProvider } from "./http-client.provider";
import { HTTP_CLIENT } from "./http-client.token";

@Global()
@Module({
  imports: [HttpModule],
  providers: [httpClientProvider],
  exports: [HTTP_CLIENT],
})
export class HttpClientModule {}
