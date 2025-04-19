import { Module } from '@nestjs/common';
import { PermissionController } from '@permission/controllers/permission.controller';
import { PermissionService } from '@permission/services/permission.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
