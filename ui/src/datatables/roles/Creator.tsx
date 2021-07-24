import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ROLE } from "../gqls";
import { Role } from "../Types";
import { Button, TextField } from "@material-ui/core";

export default function Creator() {
  const [createRole, { data }] = useMutation(CREATE_ROLE);
  const [name, setName] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (data) {
    let role: Role = data.createRole;
    return (
      <div>
        <h2>New Role successfully created!</h2>
        <p>ID: {role.id}</p>
        <p>Name: {role.name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Create a new role.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRole({ variables: { name } });
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