import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { UpdateProfileDto } from "../dto";
import { UserEntity } from "../entities";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const newUserRecord = this.userRepository.create(data);
    const newUser = await this.userRepository.save(newUserRecord);

    return newUser;
  }

  async updateById(id: string, data: Partial<UserEntity>): Promise<UpdateResult> {
    return await this.userRepository.update({ id }, data);
  }

  async updateProfile(data: UpdateProfileDto): Promise<UserEntity> {
    const { id, ...restData } = data;

    await this.userRepository.update({ id }, restData);

    return await this.userRepository.findOneBy({ id });
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOne(data: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne(data);
  }

  async delete(data: FindOptionsWhere<UserEntity>): Promise<boolean> {
    const { affected } = await this.userRepository.delete(data);
    return affected !== 0;
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
