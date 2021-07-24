export enum Mod {
  Read,
  Create,
  Edit,
  Delete,
}
export interface HasID {
  id: number;
}
export interface Role extends HasID {
  name: string;
  permissions?: Permission[];
}
export interface Permission extends HasID {
  name: string;
}
export interface User extends HasID {
  username: string;
  role?: Role;
}
export interface HasRolePropsType {
  item: Role;
}
export interface HasModPropsType {
  mod: Mod;
}
export interface HasPermissionPropsType {
  item: Permission;
}
export interface HasUserPropsType {
  item: User;
}

