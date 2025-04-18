import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@global/dto/base.entity.dto';
import { PermissionInterface } from '../interfaces/permission.interface';

export class PermissionResourceDto extends BaseEntityDto implements Partial<PermissionInterface> {
  @Expose()
  readonly id: number;
  @Expose()
  readonly name: string;
  @Expose()
  readonly group: string;
  @Expose()
  readonly label: string;
}
