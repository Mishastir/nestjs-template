import { CryptoHashService } from "./crypto-hash.service";

describe("unit test crypto service", () => {
  test("try to hash", async () => {
    const result = CryptoHashService.hash("hash_me");
    expect(result).toBeDefined();
  });

  test("try to compare hash with value", async () => {
    const text = "value_to_compare";
    const hashedText = CryptoHashService.hash(text);

    const result = CryptoHashService.compareWithHash(text, hashedText);
    expect(result).toEqual(true);
  });
});
