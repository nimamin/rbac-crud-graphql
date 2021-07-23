import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useQuery, gql, useMutation } from "@apollo/client";
import { HasID, Mod, Permission } from "./Types";
import { Button, TextField } from "@material-ui/core";

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

const ALLPERMS = gql`
  query {
    permissions {
      id
      name
    }
  }
`;

const GET_PERM = gql`
  query Permission($id: Int!) {
    permission(id: $id) {
      id
      name
    }
  }
`;

interface HasPermissionPropsType {
  item: Permission;
}
interface HasModPropsType {
  mod: Mod;
}
interface BodyPropsType extends HasPermissionPropsType, HasModPropsType {}

function Reader({ item }: HasPermissionPropsType) {
  const { loading, error, data } = useQuery(GET_PERM, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let permission: Permission = data.permission;
  return (
    <>
      <h2>Permission ID: {permission.id}</h2>
      <p>Name: {permission.name}</p>
    </>
  );
}

const CREATE_PERM = gql`
  mutation CreatePermission($name: String!) {
    createPermission(createPermissionInput: { name: $name }) {
      id
      name
    }
  }
`;

function Creator() {
  const [createPermission, { data }] = useMutation(CREATE_PERM);
  const [name, setName] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (data) {
    let permission: Permission = data.createPermission;
    return (
      <>
        <h2>New Permission successfully created!</h2>
        <p>ID: {permission.id}</p>
        <p>Name: {permission.name}</p>
      </>
    );
  }
  return (
    <>
      <h2>Create a new permission.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPermission({ variables: { name } });
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

const UPDATE_PERM = gql`
  mutation UpdatePermission($id: Int!, $name: String!) {
    updatePermission(updatePermissionInput: { id: $id, name: $name }) {
      id
      name
    }
  }
`;

function Editor({ item }: HasPermissionPropsType) {
  const [updatePermission, updateData] = useMutation(UPDATE_PERM);
  const [name, setName] = React.useState(item.name);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let permission: Permission = updateData.data.updatePermission;
    return (
      <>
        <h2>The Permission successfully updated!</h2>
        <p>ID: {permission.id}</p>
        <p>Name: {permission.name}</p>
      </>
    );
  }
  return (
    <>
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
    </>
  );
}

const REMOVE_PERM = gql`
  mutation RemovePermission($id: Int!) {
    removePermission(id: $id) {
      name
    }
  }
`;
function Remover({ item }: HasPermissionPropsType) {
  const [removePermission, { data }] = useMutation(REMOVE_PERM);
  if (data) {
    let name: string = data.removePermission.name;
    return (
      <>
        <h2>The Permission successfully removed!</h2>
        <p>Name: {name}</p>
      </>
    );
  }
  return (
    <>
      <h2>Are you sure you want to delete this Permission?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.name}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removePermission({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </>
  );
}

export default function PermissionBody({ item, mod }: BodyPropsType) {
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
