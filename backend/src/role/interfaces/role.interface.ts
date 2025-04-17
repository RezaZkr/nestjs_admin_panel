import { RolePermissionInterface } from '../../permission/interfaces/role-permission.interface';
import { UserInterface } from '@user/interfaces/user.interface';

export interface RoleInterface {
  id: number;
  name: string;
  users?: UserInterface[];
  permissions?: RolePermissionInterface[];
}
