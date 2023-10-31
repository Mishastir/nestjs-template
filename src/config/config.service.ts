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

  readonly db = {
    host: this.getString("DB_HOST"),
    port: this.getNumber("DB_PORT"),
    password: this.getString("DB_PASS"),
    user: this.getString("DB_USER"),
    name: this.getString("DB_NAME"),
    ssl: this.getBoolean("DB_USE_SSL"),
    sslCerts: this.getString("DB_SSL_CERTS"),
  };

  readonly jwt = {
    privateKey: this.getString("JWT_PRIVATE_KEY"),
    publicKey: this.getString("JWT_PUBLIC_KEY"),
    accessTtl: this.getNumber("ACCESS_TOKEN_TTL_SECONDS"),
    refreshTtl: this.getNumber("REFRESH_TOKEN_TTL_SECONDS"),
  };

  readonly google = {
    clientId: this.getString("GOOGLE_CLIENT_ID"),
    secret: this.getString("GOOGLE_CLIENT_SECRET"),
  };
}
