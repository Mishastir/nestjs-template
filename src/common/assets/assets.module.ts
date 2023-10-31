import { Global, Module } from "@nestjs/common";

import { S3_ASSETS_SERVICE } from "./constants";
import { s3AssetsProvider } from "./services";

@Global()
@Module({
  providers: [
    s3AssetsProvider,
  ],
  exports: [
    S3_ASSETS_SERVICE,
  ],
})
export class AssetsModule {}
