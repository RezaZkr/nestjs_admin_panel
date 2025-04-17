import { Controller, Get, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { RoleResourceDto } from '../dto/role-resource.dto';
import { RoleIndexDto } from '../dto/role-index.dto';
import { PaginationResponseResourceDto } from '@global/dto/offset-pagination/pagination-response-resource.dto';
import { AuthGuard } from '@auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async index(@Query() query: RoleIndexDto): Promise<PaginationResponseResourceDto<RoleResourceDto>> {
    return this.roleService.index(query);
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<RoleResourceDto> {
    return this.roleService.show(id);
  }
}
