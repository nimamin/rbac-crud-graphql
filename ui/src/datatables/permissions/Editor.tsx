import React from "react";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { UPDATE_PERM } from "../gqls";
import { HasPermissionPropsType, Permission } from "../Types";

export default function Editor({ item }: HasPermissionPropsType) {
  const [updatePermission, updateData] = useMutation(UPDATE_PERM);
  const [name, setName] = React.useState(item.name);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let permission: Permission = updateData.data.updatePermission;
    return (
      <div>
        <h2>The Permission successfully updated!</h2>
        <p>ID: {permission.id}</p>
        <p>Name: {permission.name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Edit Permission ID: {item.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePermission({ variables: { id: item.id, name } });
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