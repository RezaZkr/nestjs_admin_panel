import { Controller, Get, Query, UseGuards, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { RoleService } from '@role/services/role.service';
import { RoleResourceDto } from '@role/dto/role-resource.dto';
import { RoleIndexDto } from '@role/dto/role-index.dto';
import { PaginationResponseResourceDto } from '@global/dto/offset-pagination/pagination-response-resource.dto';
import { AuthGuard } from '@auth/guards/auth.guard';
import { UpdateRoleDto } from '@role/dto/update-role.dto';

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

  @Post(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResourceDto> {
    return this.roleService.update(id, updateRoleDto);
  }
}
