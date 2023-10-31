import { UploadFileDto } from "./dto";

export interface AssetsService {
  uploadFile(data: UploadFileDto): Promise<string>;
  signUrl(url: string): Promise<string>;
  buildUrl(key: string): string;
}
