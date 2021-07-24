import React from "react";
import { useQuery } from "@apollo/client";
import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from "@material-ui/core";
import { ALLROLES } from "../gqls";
import { Role } from "../Types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default function RoleSelector(props: any) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(ALLROLES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.onChange(event.target.value as number);
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={props.item}
        onChange={handleChange}
      >
        {data.roles?.map((role: Role) => (
          <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
