import React from "react";
import { useMutation } from "@apollo/client";
import { HasRolePropsType, Role } from "../Types";
import { UPDATE_ROLE } from "../gqls";
import { Button, createStyles, FormControl, makeStyles, TextField, Theme } from "@material-ui/core";
import PermissionSelector from "../permissions/PermissionSelector";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default function Editor({ item }: HasRolePropsType) {
  const classes = useStyles();
  const [updateRole, updateData] = useMutation(UPDATE_ROLE);
  const [name, setName] = React.useState(item.name);
  let pids: number[] = [];
  if (item.permissions) pids = item.permissions.map(p => p.id)
  const [permissionIds, setPermissionIds] = React.useState<number[]>(pids);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handlePermissionsChange = (value: number[]) => {
    setPermissionIds(value);
  };
  if (updateData.data) {
    let role: Role = updateData.data.updateRole;
    return (
      <div>
        <h2>The Role successfully updated!</h2>
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
      <h2>Edit Role ID: {item.id}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateRole({
            variables: { id: item.id, name, permissions: permissionIds },
          });
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
            Update
          </Button>
        </FormControl>
      </form>
    </div>
  );
}