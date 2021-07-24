import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useQuery, useMutation } from "@apollo/client";
import { Mod, Permission, Role, User } from "../Types";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { ALLPERMS, ALLROLES, CREATE_USER, GET_USER, REMOVE_USER, UPDATE_USER } from "../gqls";

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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);



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
      <p>Role: {user.role?.name}</p>
      <p>
        Permissions:
        {user.permissions?.map((perm) => (
          <span> {perm.name} </span>
        ))}
      </p>
    </>
  );
}


function RoleSelector(props: any) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(ALLROLES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="role-select-label">Role</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        value={props.item}
        onChange={props.onChange}
      >
        {data.roles?.map((role: Role) => (
          <MenuItem value={role.id}>{role.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function PermissionSelector(props: any) {
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

function Creator() {
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
      <>
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
      </>
    );
  }
  return (
    <div>
      <h2>Create a new user.</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ variables: { username, roleId, permissionIds } });
          
          createUser({ variables: { username, roleId, permissionIds } });
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
