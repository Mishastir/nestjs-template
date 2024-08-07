import { Body, Controller, Delete, Get, Patch } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { UpdateProfileBody } from "../dto";
import { UserModel } from "../models";
import { UsersService } from "../services";

import { SuccessResponse } from "@module/common/abstract";
import { ReqUser, WithAuth } from "@module/common/decorators";

@ApiTags("User")
@Controller("users")
@WithAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("my")
  @ApiResponse({ status: 200, type: UserModel })
  async getMyUser(@ReqUser() user: UserModel): Promise<UserModel> {
    return user;
  }

  @Delete("my")
  @ApiResponse({ status: 201, type: SuccessResponse })
  async deleteUser(@ReqUser() user: UserModel): Promise<SuccessResponse> {
    await this.userService.delete({ where: { id: user.id } });
    return { success: true };
  }

  @Patch("my")
  @ApiResponse({ status: 201, type: UserModel })
  async updateUser(@ReqUser() user: UserModel, @Body() body: UpdateProfileBody): Promise<User> {
    return await this.userService.updateProfile({ ...body, id: user.id });
  }
}
