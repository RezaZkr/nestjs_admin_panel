import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { UserInterface } from '@user/interfaces/user.interface';

export class SignInDto implements Partial<UserInterface> {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
