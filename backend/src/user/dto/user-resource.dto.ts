import { Expose } from 'class-transformer';
import { UserInterface } from '@user/interfaces/user.interface';
import { BaseEntityDto } from '@global/dto/base.entity.dto';

export class UserResourceDto extends BaseEntityDto implements Partial<UserInterface> {
  @Expose()
  readonly id: number;
  @Expose()
  readonly email: string;
  @Expose()
  readonly name: string;
  @Expose()
  readonly created_at: Date;
  @Expose()
  readonly updated_at: Date;
}
