import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { EncodedText } from "./crypto.type";

const algorithm = "aes-256-ctr";

export class CryptoService {
  constructor(private readonly secret: string) {}

  encrypt(text: string): EncodedText {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, this.secret, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  }

  decrypt(data: EncodedText): string {
    const decipher = createDecipheriv(algorithm, this.secret, Buffer.from(data.iv, "hex"));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(data.content, "hex")), decipher.final()]);

    return decrypted.toString();
  }
}
