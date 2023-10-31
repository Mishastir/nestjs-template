/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Logger } from "@nestjs/common";
import type { Logger as DatabaseLogger, QueryRunner } from "typeorm";

export class TypeormLogger implements DatabaseLogger {
  constructor(private readonly logger: Logger) {}
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    this.logger.debug({ query, parameters });
  }
  logQueryError(error: string | Error, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    this.logger.debug({ err: error, query, parameters });
  }
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    this.logger.debug({ time, query, parameters });
  }
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug({ message });
  }
  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug({ message });
  }
  log(level: "warn" | "info" | "log", message: any, _queryRunner?: QueryRunner) {
    this.logger.verbose({ message, level });
  }
}
