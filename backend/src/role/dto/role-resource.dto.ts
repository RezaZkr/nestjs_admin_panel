import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';
import { RoleInterface } from '@role/interfaces/role.interface';
import { UserInterface } from '@user/interfaces/user.interface';
import { PermissionInterface } from '@permission/interfaces/permission.interface';

export class RoleResourceDto extends BaseEntityDto implements Partial<RoleInterface> {
  @Expose()
  readonly id: number;
  @Expose()
  readonly name: string;
  @Expose()
  readonly users?: UserInterface[];
  @Expose()
  readonly permissions?: PermissionInterface[];
}
