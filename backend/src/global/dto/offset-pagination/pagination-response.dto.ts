import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class PaginationResponseDto extends BaseEntityDto {
  @Expose()
  readonly next_cursor?: number;

  @Expose()
  readonly current_page?: number;

  @Expose()
  readonly page_size?: number;

  @Expose()
  readonly total_count?: number;

  @Expose()
  readonly total_pages?: number;

  @Expose()
  readonly next_page?: number;

  @Expose()
  readonly prev_page?: number;
}
