import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator'

export class RegisterDto {

  @IsEmail()
  @IsNotEmpty()
  email:string

  @IsStrongPassword()
  @MinLength(6)
  password:string

  @IsString()
  @MinLength(3)
  fullName:string
}