import { IsString } from "class-validator";

export class ValidateGoogleTokenDto {
  @IsString()
  token: string;
}
