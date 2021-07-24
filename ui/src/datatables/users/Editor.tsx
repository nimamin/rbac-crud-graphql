import React from "react";
import { useMutation } from "@apollo/client";
import { HasUserPropsType, User } from "../Types";
import { Button, createStyles, FormControl, makeStyles, TextField, Theme } from "@material-ui/core";
import { UPDATE_USER } from "../gqls";
import RoleSelector from "../roles/RoleSelector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default function Editor({ item }: HasUserPropsType) {
  const classes = useStyles();
  const [updateUser, updateData] = useMutation(UPDATE_USER);
  const [username, setUserName] = React.useState(item.username);
  const [roleId, setRoleId] = React.useState<number>(item.role? item.role.id: 0);
  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handleRoleChange = (value: number) => {
    setRoleId(value);
  };
  if (updateData.data) {
    let user: User = updateData.data.updateUser;
    return (
      <div>
        <h2>The User successfully updated!</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.username}</p>
        <p>Role: {user.role?.name}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Edit User ID: {item.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser({ variables: { id: item.id, username, role: roleId } });
        }}
      >
        <FormControl className={classes.formControl}>
          <TextField
            label="Username"
            value={username}
            onChange={handleUserNameChange}
          />
        </FormControl>
        <RoleSelector item={roleId} onChange={handleRoleChange} />
        <FormControl className={classes.formControl}>
          <Button color="primary" variant="contained" type="submit">
            Update
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
