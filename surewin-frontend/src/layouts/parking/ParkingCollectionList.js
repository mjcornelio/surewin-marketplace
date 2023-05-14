import { filter } from "lodash";
import React, { useState } from "react";
import useResponsive from "../../hooks/useResponsive";

// material
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  CircularProgress,
  Avatar,
  Stack,
  Typography,
} from "@mui/material";
// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { fDate, fDateNumber } from "../../utils/formatTime";
import { fCurrency } from "../../utils/formatNumber";
import { CONFIG } from "../../config/config";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      array,
      (_user) =>
        _user.firstname
          .concat(" ")
          .concat(_user.lastname)
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ParkingCollectionsList({ parkingCollections, users }) {
  const [page, setPage] = useState(0);
  // eslint-disable-next-line
  const [order, setOrder] = useState("asc");
  // eslint-disable-next-line
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line
  const [orderBy, setOrderBy] = useState("unit_title");
  // eslint-disable-next-line
  const [filterName, setFilterName] = useState("");
  // eslint-disable-next-line
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMobile = useResponsive("down", "md");
  // eslint-disable-next-line
  const [pageLoading, setPageLoading] = useState(false);

  let TABLE_HEAD = [
    { id: "received_from", label: "Received From", alignRight: false },
    { id: "received_amount", label: "Received Amount", alignRight: false },
    { id: "payment_date", label: "Date", alignRight: false },
  ];

  if (isMobile) {
    TABLE_HEAD = [
      { id: "received_from", label: "From", alignRight: false },
      { id: "received_amount", label: "Amount", alignRight: false },
      { id: "payment_date", label: "Date", alignRight: false },
    ];
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - parkingCollections.length)
      : 0;

  const filteredUsers = applySortFilter(
    parkingCollections,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <div>
      <div>
        <Scrollbar>
          <UserListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeholder="Search Tenants Name..."
            search={false}
            btn="Add Collection"
            to="/transactions/parking_collections/add"
          />

          <TableContainer style={{ padding: "0 12px" }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, received_from, payment_date, received_amount } =
                      row;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    // eslint-disable-next-line

                    const name = users.find((u) => u.id === received_from)
                      ? users?.find((u) => u.id === received_from)?.firstname +
                        " " +
                        users?.find((u) => u.id === received_from)?.lastname
                      : "--";

                    return (
                      <TableRow
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#e6e6e6",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          sx={{ cursor: "pointer", p: 2 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {!isMobile && (
                              <Avatar
                                alt={"image"}
                                src={
                                  users.find((u) => u.id === received_from)
                                    ? users.find((u) => u.id === received_from)
                                        .image
                                    : ""
                                }
                              >
                                {users.find((u) => u.id === received_from)
                                  ? !users.find((u) => u.id === received_from)
                                      .image &&
                                    users
                                      .find((u) => u.id === received_from)
                                      .firstname[0].toUpperCase()
                                  : ""}
                              </Avatar>
                            )}

                            <Typography variant="subtitle2">{name}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          ₱{fCurrency(received_amount)}
                        </TableCell>

                        <TableCell align="left">
                          {isMobile
                            ? fDateNumber(payment_date)
                            : fDate(payment_date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {pageLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={8}
                      sx={{ py: 15 }}
                      rowSpan={2}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : isUserNotFound ? (
                parkingCollections.length > 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 15 }}>
                        <object
                          data="/illustrations/undraw_not_found_re_44w9.svg"
                          width="150"
                          aria-label="illustration"
                        />
                        <SearchNotFound
                          searchQuery={filterName}
                          style={{ marginTop: "2rem" }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 15 }}>
                        <object
                          data="/illustrations/undraw_no_data_re_kwbl.svg"
                          width="100"
                          aria-label="illustration"
                        />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          NO EXISTING DATA
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )
              ) : null}
            </Table>
          </TableContainer>
        </Scrollbar>

        {parkingCollections.length >= 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={parkingCollections.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
