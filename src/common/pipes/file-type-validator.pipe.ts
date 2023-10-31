import { FileValidator, Injectable } from "@nestjs/common";

interface ValidationOptions {
  fileTypes: string[];
}

@Injectable()
export class FileTypeValidator extends FileValidator<ValidationOptions> {
  private readonly allowedMimeTypes: string[];

  constructor(validationOptions: ValidationOptions) {
    super(validationOptions);

    this.allowedMimeTypes = validationOptions.fileTypes;
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {

    return this.allowedMimeTypes.includes(file.mimetype);
  }

  // eslint-disable-next-line class-methods-use-this
  buildErrorMessage(): string {
    return "File has wrong mimetype";
  }
}
