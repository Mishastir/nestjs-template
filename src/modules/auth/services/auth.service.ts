import { Injectable } from "@nestjs/common";

import { LoginUserDto, RegisterUserDto } from "../dto";

import { CryptoHashService } from "@module/common/crypto";
import { ServiceException } from "@module/common/exceptions";
import { SessionService, SessionWithUserDto } from "@module/common/session";
import { UserRole } from "@module/modules/users/enums";
import { UserModel } from "@module/modules/users/models";
import { UsersService } from "@module/modules/users/services";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) { }

  async register(data: RegisterUserDto): Promise<SessionWithUserDto> {
    const { password, ...newUser } = await this.usersService.create({ ...data });
    const session = await this.sessionService.createUserSession({ userId: newUser.id });

    return ({
      ...session,
      user: newUser as UserModel,
    });
  }

  async login(data: LoginUserDto): Promise<SessionWithUserDto> {
    const { email, password, role = UserRole.USER } = data;

    const userWithPassword = await this.usersService.findOne({
      where: { email, role },
      select: { id: true, password: true },
    });

    if (!userWithPassword) {
      throw new ServiceException("Password or email is incorrect", "INCORRECT_PASSWORD_OR_EMAIL", "VALIDATION");
    }

    const passwordIsCorrect = CryptoHashService.compareWithHash(password, userWithPassword.password);
    if (!passwordIsCorrect) {
      throw new ServiceException("Password or email is incorrect", "INCORRECT_PASSWORD_OR_EMAIL", "VALIDATION");
    }

    const user = await this.usersService.findById(userWithPassword.id) as UserModel;
    const session = await this.sessionService.createUserSession({ userId: user.id });

    return ({
      ...session,
      user,
    });
  }
}
