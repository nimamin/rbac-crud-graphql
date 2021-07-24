import React from "react";
import { useMutation } from "@apollo/client";
import { HasUserPropsType, User } from "../Types";
import { Button, TextField } from "@material-ui/core";
import { UPDATE_USER } from "../gqls";

export default function Editor({ item }: HasUserPropsType) {
  const [updateUser, updateData] = useMutation(UPDATE_USER);
  const [username, setName] = React.useState(item.username);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let user: User = updateData.data.updateUser;
    return (
      <div>
        <h2>The User successfully updated!</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.username}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Edit User ID: {item.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser({ variables: { id: item.id, username } });
        }}
      >
        <TextField label="Name" value={username} onChange={handleChange} />
        <Button color="primary" variant="contained" type="submit">
          Update
        </Button>
      </form>
    </div>
  );
}
