import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class RefreshTokenDto extends BaseEntityDto {
  @Expose()
  readonly access_token: string;
}
