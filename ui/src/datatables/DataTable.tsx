import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const ALLROLES = gql`
  query {
    roles {
      id
      name
    }
  }
`;

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 130 },
];

export default function DataTable() {
  const { loading, error, data } = useQuery(ALLROLES);
  console.log({ loading, error, data });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let rows = data.roles;
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}
