import React from "react";
import { useMutation } from "@apollo/client";
import { HasUserPropsType } from "../Types";
import { REMOVE_USER } from "../gqls";
import { Button } from "@material-ui/core";

export default function Remover({ item }: HasUserPropsType) {
  const [removeUser, { data }] = useMutation(REMOVE_USER);
  if (data) {
    let username: string = data.removeUser.username;
    return (
      <div>
        <h2>The User successfully removed!</h2>
        <p>Name: {username}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Are you sure you want to delete this User?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.username}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removeUser({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}
