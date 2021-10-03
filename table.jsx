import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BasicTable(props) {
  const classes = useStyles();
  const data = props.data;
  const keys = Object.keys(data);

  function parse(data) {
    try {
      var url = new URL(data);
      return (
        <a href={data} target="_blank" rel="noreferrer">
          🌐 {data}
        </a>
      );
    } catch (err) {
      const email =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (email.test(data)) return <a href={`mailto:${data}`}>📧 {data}</a>;
      return data;
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {keys.map(
            (key) =>
              data[key] && (
                <TableRow key={key}>
                  <TableCell align="left">{key}</TableCell>
                  <TableCell align="left">{parse(data[key])}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
