import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useQuery, gql, useMutation } from "@apollo/client";
import { HasID, Mod, User } from "./Types";
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

const ALLUSERS = gql`
  query {
    users {
      id
      username
    }
  }
`;

const GET_USER = gql`
  query User($id: Int!) {
    user(id: $id) {
      id
      username
    }
  }
`;

interface HasUserPropsType {
  item: User;
}
interface HasModPropsType {
  mod: Mod;
}
interface BodyPropsType extends HasUserPropsType, HasModPropsType {}

function Reader({ item }: HasUserPropsType) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: item.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let user: User = data.user;
  return (
    <>
      <h2>User ID: {user.id}</h2>
      <p>Name: {user.username}</p>
    </>
  );
}

const CREATE_USER = gql`
  mutation CreateUser($username: String!) {
    createUser(createUserInput: { username: $username }) {
      id
      username
    }
  }
`;

function Creator() {
  const [createUser, { data }] = useMutation(CREATE_USER);
  const [username, setName] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (data) {
    let user: User = data.createUser;
    return (
      <>
        <h2>New User successfully created!</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.username}</p>
      </>
    );
  }
  return (
    <>
      <h2>Create a new user.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser({ variables: { username } });
        }}
      >
        <TextField label="Name" value={username} onChange={handleChange} />
        <Button color="primary" variant="contained" type="submit">
          Create
        </Button>
      </form>
    </>
  );
}

const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $username: String!) {
    updateUser(updateUserInput: { id: $id, username: $username }) {
      id
      username
    }
  }
`;

function Editor({ item }: HasUserPropsType) {
  const [updateUser, updateData] = useMutation(UPDATE_USER);
  const [username, setName] = React.useState(item.username);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  if (updateData.data) {
    let user: User = updateData.data.updateUser;
    return (
      <>
        <h2>The User successfully updated!</h2>
        <p>ID: {user.id}</p>
        <p>Name: {user.username}</p>
      </>
    );
  }
  return (
    <>
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
    </>
  );
}

const REMOVE_USER = gql`
  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      username
    }
  }
`;
function Remover({ item }: HasUserPropsType) {
  const [removeUser, { data }] = useMutation(REMOVE_USER);
  if (data) {
    let username: string = data.removeUser.username;
    return (
      <>
        <h2>The User successfully removed!</h2>
        <p>Name: {username}</p>
      </>
    );
  }
  return (
    <>
      <h2>Are you sure you want to delete this User?</h2>
      <p>ID: {item.id}</p>
      <p>Name: {item.username}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          removeUser({ variables: { id: item.id } });
        }}
      >
        <Button color="secondary" variant="contained" type="submit">
          Delete
        </Button>
      </form>
    </>
  );
}

export default function UserBody({ item, mod }: BodyPropsType) {
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
