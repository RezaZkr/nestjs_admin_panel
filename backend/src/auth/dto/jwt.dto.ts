import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class JwtDto extends BaseEntityDto {
  @Expose()
  readonly access_token: string;

  @Expose()
  readonly refresh_token: string;
}
