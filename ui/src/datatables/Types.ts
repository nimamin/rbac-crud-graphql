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
}

export interface Permission extends HasID {
  name: string;
}

export interface User extends HasID {
  username: string;
  role?: Role;
  permissions?: Permission[];
}
