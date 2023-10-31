import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Hash } from "@aws-sdk/hash-node";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AssetsService } from "../assets.interface";
import { AssetsServiceConfigDto, UploadFileDto } from "../dto";

export class AssetsClient implements AssetsService {
  private readonly s3Client: S3Client;
  private readonly env: string;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly region: string;

  constructor(data: AssetsServiceConfigDto) {
    const { env, secretKey, accessKey, region, endpoint, bucket } = data;

    this.env = env;
    this.bucket = bucket;
    this.endpoint = endpoint;
    this.region = region;

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      sha256: Hash.bind(null, "sha256"),
    });
  }

  async uploadFile(data: UploadFileDto): Promise<string> {
    const { Key, Bucket = this.bucket, ...restData } = data;
    const keyWithEnv = this.addEnvToKey(Key);

    const command = new PutObjectCommand({
      ...restData,
      Bucket,
      Key: keyWithEnv,
    });

    await this.s3Client.send(command);

    return (`${this.endpoint}/${keyWithEnv}`);
  }

  async signUrl(url?: string): Promise<string> {
    if (!url) {
      return null;
    }

    const [, key] = url.split(`${this.endpoint}/`);

    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  buildUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${this.env}/${key}`;
  }

  private addEnvToKey(key: string): string {
    return (`${this.env}/${key}`);
  }
}
