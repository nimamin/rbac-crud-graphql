import React from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_PERM } from "../gqls";
import { HasPermissionPropsType } from "../Types";
import { Button } from "@material-ui/core";

export default function Remover({ item }: HasPermissionPropsType) {
  const [removePermission, { data }] = useMutation(REMOVE_PERM);
  if (data) {
    let name: string = data.removePermission.name;
    return (
      <div>
        <h2>The Permission successfully removed!</h2>
        <p>Name: {name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Are you sure you want to delete this Permission?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removePermission({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}