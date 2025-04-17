import { Module } from '@nestjs/common';
import { config } from './config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { GlobalModule } from '@global/global.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true, //access {variable} inside .env
      load: [config],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [createKeyv(config().redis_full_url, { namespace: config().app_name })],
          // stores: [createKeyv('redis://user:pass@localhost:6379', { namespace: 'nest_test' })],
        };
      },
    }),
    AuthModule,
    UserModule,
    GlobalModule,
    RoleModule,
    PermissionModule,
  ],
})
export class AppModule {}
