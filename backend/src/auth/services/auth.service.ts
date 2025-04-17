import { Injectable, Inject, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { UserResourceDto } from '@user/dto/user-resource.dto';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { SignInDto } from '@auth/dto/sign-in.dto';
import { PrismaService } from '@global/services/prisma.service';
import { UserInterface } from '@user/interfaces/user.interface';
import { checkHash } from '@global/utils/common.util';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserWithJwtDto } from '@auth/dto/user-with-jwt.dto';
import { jwtConstants } from '@auth/config/jwt.conf';
import { RefreshTokenDto } from '@auth/dto/refresh-token.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { config } from './../../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(formData: CreateUserDto): Promise<UserResourceDto> {
    return this.userService.store(formData);
  }

  async signIn(formData: SignInDto): Promise<UserWithJwtDto> {
    const foundUser: UserInterface = await this.prismaService.user.findFirst({
      where: {
        email: formData.email,
      },
    });

    if (!foundUser) {
      throw new UnauthorizedException(`User with email ${formData.email} not found`);
    }

    const isMatch: boolean = await checkHash(formData.password, foundUser.password);

    if (!isMatch) {
      throw new UnauthorizedException(`credential not matched`);
    }

    const userResource: UserResourceDto = plainToInstance(UserResourceDto, foundUser, {
      excludeExtraneousValues: true,
    });

    //... to prevent error payload must be plain object
    const accessToken: string = await this.jwtService.signAsync(
      { ...userResource },
      {
        secret: jwtConstants.access_token_secret,
        expiresIn: jwtConstants.access_token_expire_in,
      },
    );

    const refreshToken: string = await this.jwtService.signAsync(
      { ...userResource },
      {
        secret: jwtConstants.refresh_token_secret,
        expiresIn: jwtConstants.refresh_token_expire_in,
      },
    );

    const plainObject: UserWithJwtDto = {
      auth: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      user: userResource,
    };

    return plainToInstance(UserWithJwtDto, plainObject, {
      excludeExtraneousValues: true,
    });
  }

  async refreshToken(req: Request): Promise<RefreshTokenDto> {
    const userResource: UserResourceDto = plainToInstance(UserResourceDto, req['user'], {
      excludeExtraneousValues: true,
    });

    const accessToken: RefreshTokenDto = {
      access_token: await this.jwtService.signAsync(
        { ...userResource },
        {
          secret: jwtConstants.access_token_secret,
          expiresIn: jwtConstants.access_token_expire_in,
        },
      ),
    };

    return plainToInstance(RefreshTokenDto, accessToken, {
      excludeExtraneousValues: true,
    });
  }

  async me(req: Request): Promise<UserResourceDto> {
    return plainToInstance(UserResourceDto, req['user'], {
      excludeExtraneousValues: true,
    });
  }

  async signOut(req: Request, res: Response): Promise<any> {
    const accessToken: string = this.extractTokenFromHeader(req);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const blackListAccessTokens: Array<string> =
      (await this.cacheManager.get(config().black_list_access_token_cache_key)) ?? [];
    if (!blackListAccessTokens.includes(accessToken)) {
      blackListAccessTokens.push(accessToken);
      await this.cacheManager.set(config().black_list_access_token_cache_key, blackListAccessTokens);
    }

    const refreshToken: string | null = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const blackListRefreshTokens: Array<string> =
      (await this.cacheManager.get(config().black_list_refresh_token_cache_key)) ?? [];
    if (!blackListRefreshTokens.includes(refreshToken)) {
      blackListRefreshTokens.push(refreshToken);
      await this.cacheManager.set(config().black_list_refresh_token_cache_key, blackListRefreshTokens);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Signed Out',
    });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
