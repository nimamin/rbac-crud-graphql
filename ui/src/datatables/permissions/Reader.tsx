import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PERM } from "../gqls";
import { HasPermissionPropsType, Permission } from "../Types";

export default function Reader({ item }: HasPermissionPropsType) {
  const { loading, error, data } = useQuery(GET_PERM, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let permission: Permission = data.permission;
  return (
    <div>
      <h2>Permission ID: {permission.id}</h2>
      <p>Name: {permission.name}</p>
    </div>
  );
}