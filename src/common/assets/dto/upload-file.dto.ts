import { PutObjectCommandInput } from "@aws-sdk/client-s3";

export interface UploadFileDto extends Partial<PutObjectCommandInput> {
  Key: string;
}
