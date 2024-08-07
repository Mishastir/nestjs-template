import { Injectable, NestMiddleware } from "@nestjs/common";
import { json } from "body-parser";
import { Request, Response } from "express";

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, class-methods-use-this, @typescript-eslint/no-explicit-any
  use(req: Request, res: Response, next: () => any) {
    json({ limit: "10mb" })(req, res, next);
  }
}
