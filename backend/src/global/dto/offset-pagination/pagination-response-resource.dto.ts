import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';
import { PaginationResponseDto } from '@global/dto/offset-pagination/pagination-response.dto';

export class PaginationResponseResourceDto<T> extends BaseEntityDto {
  @Expose()
  readonly data: T;
  @Expose()
  readonly pagination: PaginationResponseDto;
}
