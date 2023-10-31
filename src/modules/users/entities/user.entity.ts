import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { CryptoHashService } from "../../../common/crypto";
import { UserRole } from "../enums";

@Entity({ name: "users" })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ type: "text", unique: true })
  email: string;

  @ApiPropertyOptional()
  @Column({
    nullable: true,
    type: "text",
  })
  username: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: "text",
    select: false,
  })
  password: string;

  // region Hooks

  @BeforeInsert()
  @BeforeUpdate()
  protected async hashPasswordHook(): Promise<void> {
    if (this.password) {
      this.password = CryptoHashService.hash(this.password);
    }
  }

  // endregion Hooks
}
