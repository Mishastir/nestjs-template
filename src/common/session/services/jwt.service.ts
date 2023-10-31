import { promisify } from "node:util";

import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";

import { JwtServiceConfigDto } from "../dto";
import { JWTSignResult } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Algorithm ES256 (Elliptic Curve) -> Most recommended algorithm for usage
 * src: https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms
 *
 * Alg requires private + public keys usage. Create private and public keys with Elliptic Curve
 * src: https://cloud.google.com/iot/docs/how-tos/credentials/keys#generating_an_elliptic_curve_keys
 * openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem
 * openssl ec -in ec_private.pem -pubout -out ec_public.pem
 */
export class JwtService<T> {
  private readonly signAsync: (data: Record<string, unknown>, secret: any, opts?: SignOptions) => Promise<string> = promisify(sign);
  private readonly verifyAsync: (token: string, secretOrPublic: string, opts?: VerifyOptions) => Promise<Record<string, any>> = promisify(verify);
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly ttlInSeconds?: number;

  constructor(config: JwtServiceConfigDto) {
    const { privateKey, publicKey, ttlInSeconds } = config;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.ttlInSeconds = ttlInSeconds;
  }

  public async sign(payload: T): Promise<JWTSignResult> {
    const { privateKey, ttlInSeconds } = this;
    const expiresAt = Date.now() + ttlInSeconds * 1000;
    const token = await this.signAsync(
      { ...payload, expiresAt },
      privateKey,
      { algorithm: "ES256", expiresIn: ttlInSeconds },
    );

    return { token, expiresAt, life: ttlInSeconds };
  }

  public async verify(token: string): Promise<{ isValid: boolean; payload?: T }> {
    const { publicKey } = this;
    try {
      const payload = await this.verifyAsync(token, publicKey, {
        algorithms: ["ES256"],
        ignoreExpiration: true,
        complete: false,
      });

      const { exp } = payload;

      const expInTimestamp = exp * 1000;
      const now = Date.now();
      const isExpired = now > expInTimestamp;

      if (isExpired) {
        return { isValid: false, payload: null };
      }

      return { isValid: true, payload: payload as T };
    } catch (err) {
      return { isValid: false, payload: null };
    }
  }
}
