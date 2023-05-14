import PropTypes from "prop-types";
// @mui
import {
  Card,
  CardHeader,
  Typography,
  Box,
  Divider,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

import Scrollbar from "../../../components/Scrollbar";
// ----------------------------------------------------------------------

RentalReport.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function RentalReport({ title, subheader, ...other }) {
  const unpaid = [
    { id: "1", title: "Outstanding Balance", amount: "500", due: "2015" },
    { id: "2", title: "Outstanding Balance", amount: "500", due: "2015" },
  ];

  return (
    <Card {...other} sx={{ mx: 5, mb: 5 }}>
      <CardHeader title={title} />
      <Box
        style={{
          padding: "5px 30px 30px 30px",
          backgroundColor: "#ffffff",
        }}
      >
        <Divider />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Amount</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">Due Date</Typography>
                  </TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unpaid.map((row) => {
                  const { id, title, amount, due } = row;
                  return (
                    <TableRow hover key={id} tabIndex={-1}>
                      <TableCell align="center">
                        <Typography variant="body2">{title}</Typography>
                      </TableCell>
                      <TableCell align="center">{amount}</TableCell>
                      <TableCell align="center">{due}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained">Pay Now</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Box>
    </Card>
  );
}
