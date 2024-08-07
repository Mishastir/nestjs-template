import { hostname } from "os";

import { AbstractConfigV2 } from "./abstract-config-v2";

export class ConfigService extends AbstractConfigV2 {

  readonly app = {
    name: hostname(),
    version: this.getString("VERSION", "unknown"),

    port: this.getNumber("PORT", 6001),
    env: this.getString("NODE_ENV"),
    frontendUrl: this.getString("FRONTEND_URL"),
    corsUrls: this.getStringArray("CORS_URLS", ","),
  };

  readonly logger = {
    logLevel: this.getString("LOG_LEVEL", "info"),
    prettyPrint: this.getBoolean("PINO_PRETTY", false),
  };

  readonly jwt = {
    privateKey: this.getString("JWT_PRIVATE_KEY"),
    publicKey: this.getString("JWT_PUBLIC_KEY"),
    accessTtl: this.getNumber("ACCESS_TOKEN_TTL_SECONDS"),
    refreshTtl: this.getNumber("REFRESH_TOKEN_TTL_SECONDS"),
  };
}
