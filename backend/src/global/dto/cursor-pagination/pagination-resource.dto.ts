import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class PaginationResourceDto<T> extends BaseEntityDto {
  @Expose()
  readonly data: T;
  @Expose()
  readonly next_cursor?: number;
}
