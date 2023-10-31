import { createHash } from "node:crypto";

export class CryptoHashService {

  static hash(value: string): string {
    return createHash("md5").update(value).digest("hex");
  }

  static compareWithHash(value: string, hash: string): boolean {
    const hashedValue = CryptoHashService.hash(value);

    return hash === hashedValue;
  }
}
