import { randomBytes } from "node:crypto";

import { CryptoService } from "./crypto.service";

const secret = randomBytes(16).toString("hex"); // 32 bytes for aes-256-ctr algorithm

describe("unit test crypto service", () => {
  let service: CryptoService;

  beforeEach(() => {
    service = new CryptoService(secret);
  });

  test("should be defined", () => {
    expect(service).toBeDefined();
  });

  test("try to encrypt string", async () => {
    const result = service.encrypt("encrypt_me");
    const { content, iv } = result;

    expect(iv).toBeDefined();
    expect(content).toBeDefined();
  });

  test("try to decrypt", async () => {
    const text = "ready_to_be_encrypted_and_decrypted";

    const result = service.decrypt(service.encrypt(text));
    expect(text).toEqual(result);
  });
});
