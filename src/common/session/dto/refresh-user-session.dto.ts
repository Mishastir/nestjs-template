import { CreateUserSessionDto } from "./create-user-session.dto";

export interface RefreshUserSessionDto extends CreateUserSessionDto {
  refreshToken: string;
}
