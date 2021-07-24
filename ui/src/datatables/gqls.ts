import { gql } from "@apollo/client";

export const ALLROLES = gql`
  query {
    roles {
      id
      name
      permissions {
        id
        name
      }
    }
  }
`;
export const GET_ROLE = gql`
  query Role($id: Int!) {
    role(id: $id) {
      id
      name
      permissions {
        id
        name
      }
    }
  }
`;
export const CREATE_ROLE = gql`
  mutation CreateRole($name: String!, $permissions: [Int]) {
    createRole(createRoleInput: { name: $name, permissions: $permissions }) {
      id
      name
      permissions {
        id
        name
      }
    }
  }
`;
export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: Int!, $name: String!, $permissions: [Int]) {
    updateRole(
      updateRoleInput: { id: $id, name: $name, permissions: $permissions }
    ) {
      id
      name
      permissions {
        id
        name
      }
    }
  }
`;
export const REMOVE_ROLE = gql`
  mutation RemoveRole($id: Int!) {
    removeRole(id: $id) {
      name
    }
  }
`;
export const ALLPERMS = gql`
  query {
    permissions {
      id
      name
    }
  }
`;
export const GET_PERM = gql`
  query Permission($id: Int!) {
    permission(id: $id) {
      id
      name
    }
  }
`;
export const CREATE_PERM = gql`
  mutation CreatePermission($name: String!) {
    createPermission(createPermissionInput: { name: $name }) {
      id
      name
    }
  }
`;
export const UPDATE_PERM = gql`
  mutation UpdatePermission($id: Int!, $name: String!) {
    updatePermission(updatePermissionInput: { id: $id, name: $name }) {
      id
      name
    }
  }
`;
export const REMOVE_PERM = gql`
  mutation RemovePermission($id: Int!) {
    removePermission(id: $id) {
      name
    }
  }
`;
export const ALLUSERS = gql`
  query {
    users {
      id
      username
      role {
        id
        name
      }
    }
  }
`;
export const GET_USER = gql`
  query User($id: Int!) {
    user(id: $id) {
      id
      username
      role {
        id
        name
      }
    }
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $role: Int) {
    createUser(createUserInput: { username: $username, role: $role }) {
      id
      username
      role {
        id
        name
      }
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $username: String!) {
    updateUser(updateUserInput: { id: $id, username: $username }) {
      id
      username
    }
  }
`;
export const REMOVE_USER = gql`
  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      username
    }
  }
`;
