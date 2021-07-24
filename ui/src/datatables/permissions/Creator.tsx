import React from "react";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { CREATE_PERM } from "../gqls";
import { Permission } from "../Types";

export default function Creator() {
  const [createPermission, { data }] = useMutation(CREATE_PERM);
  const [name, setName] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (data) {
    let permission: Permission = data.createPermission;
    return (
      <div>
        <h2>New Permission successfully created!</h2>
        <p>ID: {permission.id}</p>
        <p>Name: {permission.name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Create a new permission.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPermission({ variables: { name } });
        }}
      >
        <TextField label="Name" value={name} onChange={handleChange} />
        <Button color="primary" variant="contained" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
}