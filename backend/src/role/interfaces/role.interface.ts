import { UserInterface } from '@user/interfaces/user.interface';
import { PermissionInterface } from '@permission/interfaces/permission.interface';

export interface RoleInterface {
  id: number;
  name: string;
  users?: UserInterface[];
  permissions?: PermissionInterface[];
}
