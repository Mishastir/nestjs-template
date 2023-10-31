import { UserRole } from "../../users/enums";

import { LoginUserBody } from "./login-user.body";

export class LoginUserDto extends LoginUserBody {
  role?: UserRole;
}
