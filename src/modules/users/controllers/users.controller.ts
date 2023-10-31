import { Body, Controller, Delete, Get, Patch, UseInterceptors } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { UpdateProfileBody } from "../dto";
import { UserEntity } from "../entities";
import { UsersService } from "../services";

import { SuccessResponse } from "@module/common/abstract";
import { ReqUser, WithAuth } from "@module/common/decorators";
import { UserAvatarSignInterceptor } from "@module/common/interceptors";

@ApiTags("User")
@Controller("users")
@WithAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("my")
  @ApiResponse({ status: 200, type: UserEntity })
  async getMyUser(@ReqUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Delete("my")
  @ApiResponse({ status: 201, type: SuccessResponse })
  async deleteUser(@ReqUser() user: UserEntity): Promise<SuccessResponse> {
    const response = await this.userService.delete({ id: user.id });
    return { success: response };
  }

  @Patch("my")
  @ApiResponse({ status: 201, type: UserEntity })
  @UseInterceptors(UserAvatarSignInterceptor)
  async updateUser(@ReqUser() user: UserEntity, @Body() body: UpdateProfileBody): Promise<UserEntity> {
    return await this.userService.updateProfile({ ...body, id: user.id });
  }

  // @Post("my/avatar")
  // @ApiConsumes("multipart/form-data")
  // @ApiFile("avatar")
  // @UseInterceptors(FileInterceptor("avatar", { limits: { fileSize: 5e6 }}))
  // async uploadFile(
  //   @UploadImagesFile() file: Express.Multer.File,
  //   @ReqUserId() userId: number,
  // ): Promise<UploadAvatarResponseDto> {
  //   return await this.userService.saveAvatar(userId, file);
  // }
}
