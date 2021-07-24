import React from "react";
import { useMutation } from "@apollo/client";
import { Button, createStyles, FormControl, makeStyles, TextField, Theme } from "@material-ui/core";
import { CREATE_USER } from "../gqls";
import { User } from "../Types";
import RoleSelector from "../roles/RoleSelector";
import PermissionSelector from "../permissions/PermissionSelector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default function Creator() {
  const classes = useStyles();
  const [createUser, { data }] = useMutation(CREATE_USER);
  const [username, setUserName] = React.useState<string>("");
  const [roleId, setRoleId] = React.useState<number>(0);
  const [permissionIds, setPermissionIds] = React.useState<number[]>([]);
  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handleRoleChange = (value: number) => {
    setRoleId(value);
  };
  const handlePermissionsChange = (value: number[]) => {
    setPermissionIds(value);
  };

  if (data) {
    let user: User = data.createUser;
    return (
      <div>
        <h2>New User successfully created!</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.username}</p>
        <p>Role: {user.role?.name}</p>
        <p>
          Permissions:
          {user.permissions?.map((perm) => (
            <span> {perm.name} </span>
          ))}
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2>Create a new user.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ variables: { username, roleId, permissionIds } });

          createUser({ variables: { username, role: roleId, permissions: permissionIds } });
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
        <PermissionSelector
          items={permissionIds}
          onChange={handlePermissionsChange}
        />
        <FormControl className={classes.formControl}>
          <Button color="primary" variant="contained" type="submit">
            Create
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
