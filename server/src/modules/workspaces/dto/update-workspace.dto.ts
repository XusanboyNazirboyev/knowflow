import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug faqat lowercase harflar, raqamlar va - dan iborat bo‘lishi kerak',
  })
  slug?: string;
}
