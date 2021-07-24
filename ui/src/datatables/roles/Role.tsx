import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useQuery, useMutation } from "@apollo/client";
import { Mod, Role } from "../Types";
import { Button, TextField } from "@material-ui/core";
import { CREATE_ROLE, GET_ROLE, REMOVE_ROLE, UPDATE_ROLE } from "../gqls";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%)`,
    },
  })
);

interface HasRolePropsType {
  item: Role;
}
interface HasModPropsType {
  mod: Mod;
}
interface BodyPropsType extends HasRolePropsType, HasModPropsType {}

function Reader({ item }: HasRolePropsType) {
  const { loading, error, data } = useQuery(GET_ROLE, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let role: Role = data.role;
  return (
    <>
      <h2>Role ID: {role.id}</h2>
      <p>Name: {role.name}</p>
    </>
  );
}

function Creator() {
  const [createRole, { data }] = useMutation(CREATE_ROLE);
  const [name, setName] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (data) {
    let role: Role = data.createRole;
    return (
      <>
        <h2>New Role successfully created!</h2>
        <p>ID: {role.id}</p>
        <p>Name: {role.name}</p>
      </>
    );
  }
  return (
    <>
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
    </>
  );
}

function Editor({ item }: HasRolePropsType) {
  const [updateRole, updateData] = useMutation(UPDATE_ROLE);
  const [name, setName] = React.useState(item.name);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let role: Role = updateData.data.updateRole;
    return (
      <>
        <h2>The Role successfully updated!</h2>
        <p>ID: {role.id}</p>
        <p>Name: {role.name}</p>
      </>
    );
  }
  return (
    <>
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
    </>
  );
}

function Remover({ item }: HasRolePropsType) {
  const [removeRole, { data }] = useMutation(REMOVE_ROLE);
  if (data) {
    let name: string = data.removeRole.name;
    return (
      <>
        <h2>The Role successfully removed!</h2>
        <p>Name: {name}</p>
      </>
    );
  }
  return (
    <>
      <h2>Are you sure you want to delete this Role?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removeRole({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </>
  );
}

export default function RoleBody({ item, mod }: BodyPropsType) {
  const classes = useStyles();
  let currentBody = <></>;
  switch (mod) {
    case Mod.Read:
      currentBody = <Reader item={item} />;
      break;
    case Mod.Create:
      currentBody = <Creator />;
      break;
    case Mod.Edit:
      currentBody = <Editor item={item} />;
      break;
    case Mod.Delete:
      currentBody = <Remover item={item} />;
      break;

    default:
      currentBody = <Reader item={item} />;
      break;
  }
  return <div className={classes.paper}>{currentBody}</div>;
}
