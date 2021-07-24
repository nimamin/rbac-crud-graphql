import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ROLE } from "../gqls";
import { HasRolePropsType, Role } from "../Types";


export default function Reader({ item }: HasRolePropsType) {
  const { loading, error, data } = useQuery(GET_ROLE, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let role: Role = data.role;
  return (
    <div>
      <h2>Role ID: {role.id}</h2>
      <p>Name: {role.name}</p>
    </div>
  );
}
