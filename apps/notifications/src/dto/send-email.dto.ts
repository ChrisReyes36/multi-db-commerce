import { IsEmail, IsString, MinLength } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to!: string;

  @IsString()
  @MinLength(3)
  subject!: string;

  @IsString()
  @MinLength(3)
  body!: string;
}
