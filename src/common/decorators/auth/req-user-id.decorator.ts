import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqUserId = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return req.user.id;
});
