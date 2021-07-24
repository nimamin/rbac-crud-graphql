import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ROLE } from "../gqls";
import { Role } from "../Types";
import {
  Button,
  createStyles,
  FormControl,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
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
  const [createRole, { data }] = useMutation(CREATE_ROLE);
  const [name, setName] = React.useState("");
  const [permissionIds, setPermissionIds] = React.useState<number[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handlePermissionsChange = (value: number[]) => {
    setPermissionIds(value);
  };
  if (data) {
    let role: Role = data.createRole;
    return (
      <div>
        <h2>New Role successfully created!</h2>
        <p>ID: {role.id}</p>
        <p>Name: {role.name}</p>
        <p>
          Permissions:
          {role.permissions?.map((perm) => (
            <span> {perm.name} </span>
          ))}
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2>Create a new role.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRole({ variables: { name, permissions: permissionIds } });
        }}
      >
        <FormControl className={classes.formControl}>
          <TextField label="Name" value={name} onChange={handleChange} />
        </FormControl>
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
