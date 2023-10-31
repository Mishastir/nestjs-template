import { ApiProperty } from "@nestjs/swagger";

export class UploadAvatarResponseDto {
  @ApiProperty()
  url: string;
}
