import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiHeaders, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RegisterUserDto , LoginUserBody } from "../dto";
import { AuthService } from "../services";

import { ReqUser } from "@module/common/decorators";
import { RefreshAuthGuard } from "@module/common/guards";
import { SessionService, SessionWithUserDto, UserAccessTokenSessionDto } from "@module/common/session";
import { UserModel } from "@module/modules/users/models";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post("/register")
  @ApiResponse({ status: 201, type: SessionWithUserDto })
  async registerUser(@Body() body: RegisterUserDto): Promise<SessionWithUserDto> {
    return await this.authService.register(body);
  }

  @Post("/login")
  @ApiResponse({ status: 201, type: SessionWithUserDto })
  async loginUser(@Body() body: LoginUserBody): Promise<SessionWithUserDto> {
    return await this.authService.login({ ...body });
  }

  @Post("/refresh-session")
  @UseGuards(RefreshAuthGuard)
  @ApiHeaders([{ name: "Refresh-Token" }])
  @ApiResponse({ status: 201, type: UserAccessTokenSessionDto })
  async refreshUserSession(@ReqUser() user: UserModel): Promise<UserAccessTokenSessionDto> {
    return await this.sessionService.createUserSession({ userId: user.id });
  }
}
