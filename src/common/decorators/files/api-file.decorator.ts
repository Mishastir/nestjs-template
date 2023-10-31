import { ApiBody } from "@nestjs/swagger";

export const ApiFile = (fileName: string): MethodDecorator => (
  ApiBody({
    schema: {
      type: "object",
      properties: {
        [fileName]: {
          type: "string",
          format: "binary",
        },
      },
      required: [fileName],
    },
  })
);
