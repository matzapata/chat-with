import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 20)
  readonly password: string;
}
