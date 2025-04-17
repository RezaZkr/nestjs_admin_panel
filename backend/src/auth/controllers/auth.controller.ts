import { Body, Controller, Post, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from '@auth/services/auth.service';
import { UserResourceDto } from '@user/dto/user-resource.dto';
import { SignInDto } from '@auth/dto/sign-in.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthGuard } from '@auth/guards/auth.guard';
import { Request as ExpressRequest, Response } from 'express';
import { UserWithJwtDto } from '@auth/dto/user-with-jwt.dto';
import { RefreshTokenGuard } from '@auth/guards/refresh-token.guard';
import { RefreshTokenDto } from '@auth/dto/refresh-token.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() formData: CreateUserDto): Promise<UserResourceDto> {
    return this.authService.signUp(formData);
  }

  @Post('sign-in')
  async signIn(@Body() formData: SignInDto, @Res() res: Response) {
    // console.log('1111111111111111111111111111');
    // console.log(formData);
    // console.log('1111111111111111111111111111');
    const UserWithJwt: UserWithJwtDto = await this.authService.signIn(formData);
    res.cookie('refresh_token', UserWithJwt.auth.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    return res.json({
      auth: {
        access_token: UserWithJwt.auth.access_token,
      },
      user: UserWithJwt.user,
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req: ExpressRequest, @Res() res: Response) {
    const RefreshToken: RefreshTokenDto = await this.authService.refreshToken(req);

    return res.json({
      auth: {
        access_token: RefreshToken.access_token,
      },
      user: plainToInstance(UserResourceDto, req['user'], {
        excludeExtraneousValues: true,
      }),
    });
  }

  @UseGuards(AuthGuard)
  @Post('sign-out')
  async signOut(@Request() req: ExpressRequest, @Res() res: Response): Promise<any> {
    return this.authService.signOut(req, res);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() req: ExpressRequest): Promise<UserResourceDto> {
    return this.authService.me(req);
  }
}
