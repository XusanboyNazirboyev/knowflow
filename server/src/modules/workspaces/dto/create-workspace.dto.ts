import { IsString, MinLength, Matches } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      "Slug faqat kichik harflar, raqamlar va tire (-) dan iborat bo'lishi mumkin",
  })
  slug: string;
}
