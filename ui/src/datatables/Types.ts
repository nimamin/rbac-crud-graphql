export enum Mod {
  Read,
  Create,
  Edit,
  Delete,
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  role: Role;
  permissions: Permission[];
}
