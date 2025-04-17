import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@auth/config/jwt.conf';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { config } from './../../config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken: string | null = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const accessToken = this.extractTokenFromHeader(request);
    if (accessToken) {
      const blackListAccessTokens: Array<string> =
        (await this.cacheManager.get(config().black_list_access_token_cache_key)) ?? [];
      if (!blackListAccessTokens.includes(accessToken)) {
        blackListAccessTokens.push(accessToken);
        await this.cacheManager.set(config().black_list_access_token_cache_key, blackListAccessTokens);
      }
    }

    const blackListRefreshTokens: Array<string> =
      (await this.cacheManager.get(config().black_list_refresh_token_cache_key)) ?? [];
    if (blackListRefreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException();
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refresh_token_secret,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
