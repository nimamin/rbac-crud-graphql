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
import { Mod, User } from "./Types";
import UserBody from "./User";

const ALLUSERS = gql`
  query {
    users {
      id
      username
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
  })
);


export default function Orders() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mod, setMod] = React.useState(Mod.Read);
  const [selectedItem, setSelectedItem] = React.useState<User>({id:0,username:""});

  const { loading, error, data, refetch } = useQuery(ALLUSERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleOpen = (e: any) => {
    console.log("key:", e.target.parent.parent.getAttribute("key"));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refetch();
  };

  const handleCRUD = (m: Mod, item?: User) => {
    if (item) setSelectedItem(item);
    setMod(m);
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Title>Users</Title>
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
          {data.users.map((item: User) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Read, item)}
                >
                  Read
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Edit, item)}
                  color="primary"
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleCRUD(Mod.Delete, item)}
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
        <UserBody item={selectedItem} mod={mod} />
      </Modal>
    </React.Fragment>
  );
}
