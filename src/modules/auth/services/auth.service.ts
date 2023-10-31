import { Injectable } from "@nestjs/common";

import { UserEntity } from "../../users/entities";
import { UserRole } from "../../users/enums";
import { UsersService } from "../../users/services";
import { LoginUserDto, RegisterUserDto } from "../dto";

import { CryptoHashService } from "@module/common/crypto";
import { ServiceException } from "@module/common/exceptions";
import { SessionService, SessionWithUserDto } from "@module/common/session";

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
      user: newUser as UserEntity,
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

    const user = await this.usersService.findById(userWithPassword.id);
    const session = await this.sessionService.createUserSession({ userId: user.id });

    return ({
      ...session,
      user,
    });
  }
}
