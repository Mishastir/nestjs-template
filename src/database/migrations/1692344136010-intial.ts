import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1692344136010 implements MigrationInterface {
  name = "initial1692344136010";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
    await queryRunner.query(`
        CREATE TABLE "users"
        (
            "id"       uuid                       NOT NULL DEFAULT uuid_generate_v4(),
            "email"    text                       NOT NULL,
            "username" text,
            "role"     "public"."users_role_enum" NOT NULL DEFAULT 'USER',
            "password" text                       NOT NULL,
            CONSTRAINT "pkey_users_id" PRIMARY KEY ("id"),
            CONSTRAINT "uq_users_email" UNIQUE ("email")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }

}
