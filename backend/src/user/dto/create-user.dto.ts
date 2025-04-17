import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserInterface } from '@user/interfaces/user.interface';

export class CreateUserDto implements Partial<UserInterface> {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @IsString()
  @IsOptional()
  name: string;
}
