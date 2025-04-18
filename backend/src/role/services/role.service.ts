import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@global/services/prisma.service';
import { RoleResourceDto } from '../dto/role-resource.dto';
import { plainToInstance } from 'class-transformer';
import { RoleIndexDto } from '../dto/role-index.dto';
import { Prisma } from '@prisma/client';
import { PaginationResponseResourceDto } from '@global/dto/offset-pagination/pagination-response-resource.dto';
import { RoleInterface } from '../interfaces/role.interface';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(query: RoleIndexDto): Promise<PaginationResponseResourceDto<RoleResourceDto>> {
    const { name, take, page } = query;

    const where: Prisma.RoleWhereInput = name
      ? {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }
      : {};

    //cursor pagination example
    // const { name, take, cursor } = query;
    // const roles: RoleInterface[] = await this.prismaService.role.findMany({
    //   take: take + 1,
    //   skip: cursor ? 1 : 0,
    //   cursor: cursor ? { id: parseInt(cursor) } : undefined,
    //   where: where,
    //   orderBy: { id: 'asc' },
    // });
    // const hasNextPage = roles.length > take;
    // const items: RoleInterface[] = hasNextPage ? roles.slice(0, -1) : roles;
    // const nextCursor: number = hasNextPage ? items[items.length - 1].id : null;

    const [roles, totalCount] = await this.prismaService.$transaction([
      this.prismaService.role.findMany({
        take: take,
        skip: (page - 1) * take,
        where: where,
        orderBy: { id: 'asc' },
      }),
      this.prismaService.role.count({ where: where }),
    ]);

    const totalPages: number = Math.ceil(totalCount / take);

    const nextPage: number = page < totalPages ? page + 1 : null;
    const prevPage: number = page > 1 ? page - 1 : null;

    return plainToInstance(
      PaginationResponseResourceDto<RoleResourceDto>,
      {
        data: roles,
        pagination: {
          current_page: page,
          page_size: take,
          total_count: totalCount,
          total_pages: totalPages,
          next_page: nextPage,
          prev_page: prevPage,
        },
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async show(id: number): Promise<RoleResourceDto> {
    const role: RoleInterface = await this.prismaService.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToInstance(RoleResourceDto, role, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, body: UpdateRoleDto): Promise<RoleResourceDto> {
    const role: RoleInterface = await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException();
    }

    //todo implement update role with their permissions

    return plainToInstance(RoleResourceDto, role, {
      excludeExtraneousValues: true,
    });
  }
}
