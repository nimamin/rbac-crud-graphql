import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";
import {
  useQuery,
  gql,
} from "@apollo/client";
import Title from "./Title";
import { Mod, Role } from "./Types";

const ALLROLES = gql`
  query {
    roles {
      id
      name
    }
  }
`;

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
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


interface BodyPropsType {
  item: Role;
  mod: Mod;
}

function Body({ item, mod }: BodyPropsType) {
  const classes = useStyles();
  const readBody = (
    <div className={classes.paper}>
      <h2>Role ID: {item.id}</h2>
      <p>Name: {item.name}</p>
    </div>
  );
  const editBody = (
    <div className={classes.paper}>
      <h2>Edit Role ID: {item.id}</h2>
      <p>Name: {item.name}</p>
    </div>
  );
  const createBody = (
    <div className={classes.paper}>
      <h2>Create a new role.</h2>
      <p>Name: {item.name}</p>
    </div>
  );
  const deleteBody = (
    <div className={classes.paper}>
      <h2>Delete Role ID: {item.id}</h2>
      <p>Name: {item.name}</p>
    </div>
  );
  let currectBody = <></>;
  switch (mod) {
    case Mod.Read:
      currectBody = readBody;
      break;
    case Mod.Edit:
      currectBody = editBody;
      break;
    case Mod.Create:
      currectBody = createBody;
      break;
    case Mod.Delete:
      currectBody = deleteBody;
      break;
  
    default:
      currectBody = readBody;
      break;
  }
  return currectBody;
}

export default function Orders() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mod, setMod] = React.useState(Mod.Read);
  const [selectedItem, setSelectedItem] = React.useState({ id: 0, name: "" });

  const { loading, error, data } = useQuery(ALLROLES);
  console.log({ loading, error, data });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleOpen = (e: any) => {
    console.log("key:", e.target.parent.parent.getAttribute("key"));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCRUD = (m: Mod, item?: Role) => {
    if (item) setSelectedItem(item);
    setMod(m);
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Title>Roles</Title>
      <Typography>
        <Button variant="contained" onClick={() => handleCRUD(Mod.Create)}>
          Create
        </Button>
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.roles.map((role: Role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Read, role)}
                >
                  Read
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Edit, role)}
                  color="primary"
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Delete, role)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={open} onClose={handleClose}>
        <Body item={selectedItem} mod={mod} />
      </Modal>
    </React.Fragment>
  );
}
