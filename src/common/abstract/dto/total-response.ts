import { ApiProperty } from "@nestjs/swagger";

export class TotalResponse {
  @ApiProperty()
  total: number;
}
