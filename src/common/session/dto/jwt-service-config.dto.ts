export interface JwtServiceConfigDto {
  privateKey: string;
  publicKey: string;
  ttlInSeconds: number;
}
