import React from "react";
import { useQuery } from "@apollo/client";
import { ALLPERMS } from "../gqls";
import { createStyles, FormControl, InputLabel, makeStyles, Select, Theme } from "@material-ui/core";
import { Permission } from "../Types";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default function PermissionSelector(props: any) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(ALLPERMS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChangeMultiple = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    props.onChange(value);
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink htmlFor="permission-select-label">
        Permission
      </InputLabel>
      <Select
        multiple
        native
        labelId="permission-select-label"
        id="permission-select"
        value={props.items}
        onChange={handleChangeMultiple}
        inputProps={{
          id: "select-multiple-native",
        }}
      >
        {data.permissions?.map((permission: Permission) => (
          <option key={permission.id} value={permission.id}>
            {permission.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
