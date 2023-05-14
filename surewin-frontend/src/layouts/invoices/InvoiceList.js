import { filter } from "lodash";
import React, { useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import { useNavigate } from "react-router-dom";

// material
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Button,
  TableContainer,
  TablePagination,
  CircularProgress,
  Chip,
} from "@mui/material";
// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
  UserListHead,
  UserMoreMenu,
  UserListToolbar,
} from "../../sections/@dashboard/user";
import { fMonthandYear } from "../../utils/formatTime";
import { fCurrency } from "../../utils/formatNumber";

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
      (_user) => _user.unit_title.indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function InvoiceList({ invoices, tenants, user, tenant_id }) {
  const [page, setPage] = useState(0);
  // eslint-disable-next-line
  const [order, setOrder] = useState("asc");
  // eslint-disable-next-line
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line
  const [orderBy, setOrderBy] = useState("unit_title");
  // eslint-disable-next-line
  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  // eslint-disable-next-line
  const [alert, setAlert] = useState(null);
  const isMobile = useResponsive("down", "md");
  // eslint-disable-next-line
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

  let TABLE_HEAD = [
    { id: "status", label: "Status", alignRight: false },
    { id: "monthANDyear", label: "Month and year", alignRight: false },
    { id: "payment_for", label: "Payment For", alignRight: false },
    { id: "amount_to_paid", label: "Amount To Paid", alignRight: false },
    { id: "received", label: "Received", alignRight: false },
    { id: "balance", label: "Balance", alignRight: false },
    { id: "action", label: "", alignRight: true },
  ];
  if (tenants) {
    TABLE_HEAD = [
      { id: "status", label: "Status", alignRight: false },
      { id: "payers_name", label: "Payers Name", alignRight: false },
      { id: "monthANDyear", label: "Month and year", alignRight: false },
      { id: "payment_for", label: "Payment For", alignRight: false },
      { id: "amount_to_paid", label: "Amount To Paid", alignRight: false },
      { id: "received", label: "Received", alignRight: false },
      { id: "balance", label: "Balance", alignRight: false },
      { id: "action", label: "", alignRight: true },
    ];
  }
  if (isMobile) {
    TABLE_HEAD = [
      { id: "status", label: "Status", alignRight: false },
      { id: "payment_for", label: "Payment For", alignRight: false },
      { id: "amount_to_paid", label: "Amount To Paid", alignRight: false },
    ];
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoices.length) : 0;

  const filteredUsers = applySortFilter(
    invoices,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <div>
      <div>
        <Scrollbar>
          {user !== "tenant" && (
            <UserListToolbar
              numSelected={selected.length}
              filterName={filterName}
              placeholder="Search Tenants Name..."
              btn="Add Invoice"
              search={false}
              to={
                tenant_id
                  ? `/invoices/add?tenant=${tenant_id}`
                  : "/invoices/add"
              }
            />
          )}

          <TableContainer>
            <Table>
              <UserListHead headLabel={TABLE_HEAD} checkbox={false} />

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      due_date,
                      status,
                      payment_for,
                      amount_to_paid,
                      received,
                      tenant_id,
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

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
                          align="left"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate(`/invoices/${id}?tenant=${tenant_id}`);
                          }}
                        >
                          <Chip
                            label={status}
                            color={
                              status === "Paid"
                                ? "success"
                                : status === "Partial"
                                ? "secondary"
                                : "error"
                            }
                            variant="filled"
                          />
                        </TableCell>

                        {!isMobile && (
                          <>
                            {tenants && (
                              <TableCell align="left">
                                {tenants?.find((t) => t.id === tenant_id)
                                  .firstname +
                                  " " +
                                  tenants?.find((t) => t.id === tenant_id)
                                    .lastname}
                              </TableCell>
                            )}
                            <TableCell align="left">
                              {fMonthandYear(due_date)}
                            </TableCell>
                          </>
                        )}
                        <TableCell align="left">{payment_for}</TableCell>

                        <TableCell align="left">
                          ₱{fCurrency(amount_to_paid)}
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell align="left">
                              ₱{fCurrency(received)}
                            </TableCell>
                            <TableCell align="left">
                              ₱{fCurrency(amount_to_paid - received)}
                            </TableCell>
                            {user === "tenant" && (
                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    navigate(`/invoices/${id}`);
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            )}
                          </>
                        )}
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
                invoices.length > 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 15 }}>
                        NO EXISTING DATA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )
              ) : null}
            </Table>
          </TableContainer>
        </Scrollbar>

        {invoices.length >= 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={invoices.length}
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
