import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { CreateUserDto, UpdateProfileDto } from "../dto";
import { UserModel } from "../models";

import { PrismaService } from "@database";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(data: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({ data });
  }

  async updateById(id: string, data: Partial<UserModel>): Promise<User> {
    return await this.prismaService.user.update({ where: { id }, data });
  }

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const { id, ...restData } = data;

    return await this.prismaService.user.update({ where: { id }, data: restData });
  }

  async findById(id: string): Promise<User> {
    return await this.prismaService.user.findUniqueOrThrow({ where: { id } });
  }

  async findOne(data: Prisma.UserFindFirstArgs): Promise<User> {
    return await this.prismaService.user.findFirst(data);
  }

  async delete(data: Prisma.UserDeleteArgs): Promise<void> {
    await this.prismaService.user.delete(data);
  }

  // async saveAvatar(userId: string, file: Express.Multer.File): Promise<UploadAvatarResponseDto> {
  //   const extension = file.originalname.split(".").pop();
  //
  //   // We add env in assetsService
  //   const key = `users/${userId}/avatar.${extension}`;
  //
  //   const url = await this.assetsService.uploadFile({
  //     // Bucket is defined in assetsService, not required param
  //     Key: key,
  //     ContentType: file.mimetype,
  //     Body: file.buffer,
  //     ContentLength: file.size,
  //   });
  //
  //   await this.userRepository.update({ id: userId }, { avatarUrl: url });
  //
  //   const signedUrl = await this.assetsService.signUrl(url);
  //   return ({ url: signedUrl });
  // }
}
