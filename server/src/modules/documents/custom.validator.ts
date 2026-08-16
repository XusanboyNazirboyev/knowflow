import { FileValidator } from '@nestjs/common';

export class CustomFileTypeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    // MIME type tarkibida charset bo'lsa, faqat asosiy qismini olamiz
    const fileMimeType = file.mimetype.split(';')[0].trim();

    return allowedMimeTypes.includes(fileMimeType);
  }

  buildErrorMessage(): string {
    return 'Faqat PDF, TXT va MD formatidagi fayllar qabul qilinadi!';
  }
}
