import { Module } from '@nestjs/common';
import { UserService } from '@user/services/user.service';
import { UserController } from '@user/controllers/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
