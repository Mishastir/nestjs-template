export class GenerateSignedUrlDto {
  bucket: string;
  key: string;
  expiresIn?: number = 3600;
}
