import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@app/contracts/enums/roles';

export class RegisterRequestDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
