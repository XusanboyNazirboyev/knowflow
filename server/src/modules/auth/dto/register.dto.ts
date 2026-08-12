import {
  IsEmail,
  IsString,
  MinLength,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';



export class RegisterDto {
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  email: string;

  @IsString()
  @IsStrongPassword(
    {},
    {
      message:
        "Parol kamida 8 belgi, katta/kichik harf, raqam va maxsus belgidan iborat bo'lishi kerak",
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  confirmPassword?: string;

  @IsString()
  @MinLength(2)
  fullName: string;
}
