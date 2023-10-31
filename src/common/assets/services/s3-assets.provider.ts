import { FactoryProvider, Logger } from "@nestjs/common";

import { S3_ASSETS_SERVICE } from "../constants";

import { AssetsClient } from "./assets.client";

import { ConfigService } from "@module/config";


export const s3AssetsProvider: FactoryProvider<AssetsClient> = {
  provide: S3_ASSETS_SERVICE,
  useFactory: (/* config: ConfigService */) => {
    // const { app: { env } } = config;
    //
    // const endpoint = `https://${config.s3.bucket}.s3.${config.aws.region}.amazonaws.com`;
    //
    // return new AssetsClient({ endpoint, ...config.s3, ...config.aws, env });
    Logger.error("S3_ASSETS_SERVICE is not implemented!!!");
    return {} as AssetsClient;
  },
  inject: [ConfigService],
};
