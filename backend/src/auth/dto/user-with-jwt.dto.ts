import { Expose, Type } from 'class-transformer';
import { UserResourceDto } from '@user/dto/user-resource.dto';
import { JwtDto } from '@auth/dto/jwt.dto';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class UserWithJwtDto extends BaseEntityDto {
  @Expose()
  @Type(() => JwtDto) // Ensure proper serialization
  readonly auth: JwtDto;

  @Expose()
  @Type(() => UserResourceDto) // Ensure proper serialization
  readonly user: UserResourceDto;
}
