import { Module } from '@nestjs/common';
import { RoleService } from '@role/services/role.service';
import { RoleController } from '@role/controllers/role.controller';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
