import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PaginationResponseResourceDto } from '@global/dto/offset-pagination/pagination-response-resource.dto';
import { PermissionIndexDto } from '../dto/permission-index.dto';
import { PermissionResourceDto } from '../dto/permission-resource.dto';
import { AuthGuard } from '@auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async index(@Query() query: PermissionIndexDto): Promise<PaginationResponseResourceDto<PermissionResourceDto>> {
    return this.permissionService.index(query);
  }
}
