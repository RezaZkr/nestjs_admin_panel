import { Injectable } from '@nestjs/common';
import { PrismaService } from '@global/services/prisma.service';
import { PaginationResponseResourceDto } from '@global/dto/offset-pagination/pagination-response-resource.dto';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PermissionIndexDto } from '@permission/dto/permission-index.dto';
import { PermissionResourceDto } from '@permission/dto/permission-resource.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async index(query: PermissionIndexDto): Promise<PaginationResponseResourceDto<PermissionResourceDto>> {
    const { name, group, take, page } = query;

    const where: Prisma.PermissionWhereInput = {
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(group && {
        group: {
          contains: group,
          mode: 'insensitive',
        },
      }),
    };

    const [permissions, totalCount] = await this.prismaService.$transaction([
      this.prismaService.permission.findMany({
        take: take,
        skip: (page - 1) * take,
        where: where,
        orderBy: { id: 'asc' },
      }),
      this.prismaService.permission.count({ where: where }),
    ]);

    const totalPages: number = Math.ceil(totalCount / take);

    const nextPage: number = page < totalPages ? page + 1 : null;
    const prevPage: number = page > 1 ? page - 1 : null;

    return plainToInstance(
      PaginationResponseResourceDto<PermissionResourceDto>,
      {
        data: permissions,
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
}
