import { RoleInterface } from '@role/interfaces/role.interface';
import { PermissionInterface } from '@permission/interfaces/permission.interface';

export interface RolePermissionInterface {
  role_id: number;
  permission_id: number;
  role?: RoleInterface;
  permission?: PermissionInterface;
}
