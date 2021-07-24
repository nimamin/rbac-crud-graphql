import React from "react";
import { useMutation } from "@apollo/client";
import { HasRolePropsType } from "../Types";
import { REMOVE_ROLE } from "../gqls";
import { Button } from "@material-ui/core";

export default function Remover({ item }: HasRolePropsType) {
  const [removeRole, { data }] = useMutation(REMOVE_ROLE);
  if (data) {
    let name: string = data.removeRole.name;
    return (
      <div>
        <h2>The Role successfully removed!</h2>
        <p>Name: {name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Are you sure you want to delete this Role?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removeRole({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}