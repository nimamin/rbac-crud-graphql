import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { useQuery } from "@apollo/client";
import Title from "../Title";
import { Mod, Permission } from "../Types";
import PermissionBody from "./Permission";
import { ALLPERMS } from "../gqls";

export default function Permissions() {
  const [open, setOpen] = React.useState(false);
  const [mod, setMod] = React.useState(Mod.Read);
  const [selectedItem, setSelectedItem] = React.useState({ id: 0, name: "" });

  const { loading, error, data, refetch } = useQuery(ALLPERMS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleClose = () => {
    setOpen(false);
    refetch();
  };

  const handleCRUD = (m: Mod, item?: Permission) => {
    if (item) setSelectedItem(item);
    setMod(m);
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Title>Permissions</Title>
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
          {data.permissions.map((item: Permission) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
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
        <PermissionBody item={selectedItem} mod={mod} />
      </Modal>
    </React.Fragment>
  );
}
