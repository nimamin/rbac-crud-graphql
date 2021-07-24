import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../gqls";
import { HasUserPropsType, User } from "../Types";

export default function Reader({ item }: HasUserPropsType) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let user: User = data.user;
  return (
    <div>
      <h2>User ID: {user.id}</h2>
      <p>Name: {user.username}</p>
      <p>Role: {user.role?.name}</p>
    </div>
  );
}
