import { Controller } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
}
