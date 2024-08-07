import { ParseFilePipe, UploadedFile } from "@nestjs/common";

import { FileTypeValidator } from "../../pipes";

export const UploadImagesFile = (): ParameterDecorator => (
  UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileTypes: ["image/jpeg", "image/pjpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
        }),
      ],
    }),
  )
);
