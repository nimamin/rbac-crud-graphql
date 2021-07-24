import React from "react";
import { useMutation } from "@apollo/client";
import { HasRolePropsType, Role } from "../Types";
import { UPDATE_ROLE } from "../gqls";
import { Button, TextField } from "@material-ui/core";

export default function Editor({ item }: HasRolePropsType) {
  const [updateRole, updateData] = useMutation(UPDATE_ROLE);
  const [name, setName] = React.useState(item.name);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let role: Role = updateData.data.updateRole;
    return (
      <div>
        <h2>The Role successfully updated!</h2>
        <p>ID: {role.id}</p>
        <p>Name: {role.name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Edit Role ID: {item.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateRole({ variables: { id: item.id, name } });
        }}
      >
        <TextField label="Name" value={name} onChange={handleChange} />
        <Button color="primary" variant="contained" type="submit">
          Update
        </Button>
      </form>
    </div>
  );
}