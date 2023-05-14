import React from "react";
import { filter } from "lodash";
import { useState } from "react";
import axios from "axios";

import useResponsive from "../../hooks/useResponsive";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

// material
import {
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Paper,
  TableHead,
  InputAdornment,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";

// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { CONFIG } from "../../config/config";
import {
  fDate,
  fDateNumber,
  fDateWord,
  fMonthandYear,
} from "src/utils/formatTime";
import { fCurrency } from "src/utils/formatNumber";
import Iconify from "src/components/Iconify";
import { Box } from "@mui/system";
import Logo from "src/components/Logo";
import { useEffect } from "react";
const user = JSON.parse(localStorage.getItem("user"));
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

const Receipt = React.forwardRef((props, ref) => {
  const { tenant, items, receiptNo } = props;

  return (
    <div
      ref={ref}
      style={{
        width: "150px",
        position: "absolute",
        top: "10px",
        color: "black",
        left: "20px",
      }}
    >
      <Logo src="logo.png" sx={{ width: 40, margin: "auto" }} />
      <Typography variant="h6" textAlign={"center"} sx={{ fontSize: "10px" }}>
        R & A Surewin Marketplace
      </Typography>
      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        Tungkong Mangga, City of San Jose Del Monte, Bulacan
      </Typography>
      <Box sx={{ height: "2px", width: "100%", backgroundColor: "#000000" }} />
      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        OR Number: {receiptNo}
      </Typography>

      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        {fDate(new Date())}
      </Typography>
      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        {tenant}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "8px", mt: 2 }}>
        <strong>
          Payment For
          <span style={{ float: "right" }}>Amount</span>
        </strong>
      </Typography>
      {items.map((i) => {
        return (
          <div key={i.id}>
            <Grid
              container
              style={{
                width: "100%",
              }}
            >
              {console.log(tenant)}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontSize: "8px", my: "5px" }}>
                  {i.payment_for} for{" "}
                  {i.payment_for.toLowerCase() === "rent"
                    ? fDateWord(i.due_date)
                    : fMonthandYear(i.due_date)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "8px", my: "5px", textAlign: "right" }}
                >
                  {fCurrency(i.balance)}
                </Typography>
              </Grid>
            </Grid>
          </div>
        );
      })}
      <Box
        sx={{ height: "0.5px", width: "100%", backgroundColor: "#000000" }}
      />
      <Typography variant="body1" sx={{ fontSize: "10px", mt: 1 }}>
        <strong>
          Total
          <span style={{ float: "right" }}>
            ₱
            {fCurrency(
              items.length > 1
                ? items.map((i) => i.balance).reduce((t, c) => t + c)
                : items[0]?.balance
            )}
          </span>
        </strong>
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "10px",
          margin: "1rem auto 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90px",
        }}
      >
        <span>{user.firstname + ", " + user.lastname}</span>
        <span
          style={{ width: "100px", height: "1px", backgroundColor: "black" }}
        />
        <span>Received By:</span>
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: "10px", mt: 2, mb: 3, textAlign: "center" }}
      >
        <strong>THANK YOU</strong>
      </Typography>
    </div>
  );
});

export default function RentTransactions({
  TENANTS,
  invoices,
  setReRender,
  reRender,
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("firstname");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMobile = useResponsive("down", "md");
  // eslint-disable-next-line
  const [pageLoading, setPageLoading] = useState(false);
  const [view, setView] = useState(false);
  const [pay, setPay] = useState(false);
  const [tenantId, setTenantId] = useState(null);
  const [rentAmount, setRentAmount] = useState(0);
  const [itemArray, setItemArray] = useState([]);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const receiptRef = React.createRef();
  const [transactionId, setTransactionId] = useState(null);
  const handleClick = useReactToPrint({
    content: () => receiptRef.current,
  });
  useEffect(() => {}, [alert]);

  const navigate = useNavigate();

  let TABLE_HEAD = [
    { id: "name", label: "Tenants Name", alignRight: false },
    { id: "stall", label: "Unit/s", alignRight: false },
    { id: "rent", label: "Rent", alignRight: false },
    {
      id: "balance",
      label: `Balance as of Today`,
      alignRight: false,
    },
    { id: "action", label: "", alignRight: true },
  ];

  if (isMobile) {
    TABLE_HEAD = [
      { id: "name", label: "Tenants Name", alignRight: false },

      {
        id: "balance",
        label: `Balance`,
        alignRight: false,
      },
      { id: "action", label: "", alignRight: true },
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - TENANTS.length) : 0;

  const filteredUsers = applySortFilter(
    TENANTS,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <div>
      <div>
        <Snackbar
          open={Boolean(alert)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => {
            setAlert(null);
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
            onClose={() => {
              setAlert(null);
            }}
          >
            {alert}
          </Alert>
        </Snackbar>
        {/* View Invoices */}
        <Dialog
          open={view}
          onClose={() => {
            setView(false);
          }}
          maxWidth={"md"}
          fullWidth
          fullScreen={isDesktop ? false : true}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setView(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Iconify icon="ep:close-bold" />
            </IconButton>
          </DialogTitle>
          <DialogContent
            style={{
              paddingTop: isDesktop === true ? 0 : 20,
            }}
          >
            <div>
              <TableContainer
                component={Paper}
                sx={{ px: 5, width: "816px", mb: 5, mt: 2 }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  Rental Balance Sheet
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  {tenantId &&
                    TENANTS.filter((t) => t.id === tenantId)[0].firstname +
                      " " +
                      TENANTS.filter((t) => t.id === tenantId)[0].lastname}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  As of {fDateWord(new Date())}
                </Typography>
                <Table
                  aria-label="simple table"
                  sx={{
                    ".MuiTableCell-root": {
                      borderColor: "1px solid green",
                      border: 1,
                      p: 1,
                      fontSize: "10px",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#e6e6ff",
                      }}
                    >
                      <TableCell>Payment For</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount To Be Paid</TableCell>
                      <TableCell>Received</TableCell>
                      <TableCell>Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices
                      .filter((i) => i.tenant_id === tenantId)
                      .filter((i) => i.status !== "Paid")
                      .map((item) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.payment_for}</TableCell>
                            <TableCell>
                              {item.payment_for.toLowerCase() === "rent"
                                ? fDateNumber(item.due_date)
                                : fMonthandYear(item.due_date)}
                            </TableCell>
                            <TableCell>{item.description}</TableCell>

                            <TableCell>
                              ₱{fCurrency(item.amount_to_paid)}
                            </TableCell>
                            <TableCell>₱{fCurrency(item.received)}</TableCell>
                            <TableCell>
                              ₱{fCurrency(item.amount_to_paid - item.received)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow>
                      <TableCell colSpan={3}></TableCell>
                      <TableCell>
                        ₱
                        {fCurrency(
                          invoices
                            .filter((i) => i.tenant_id === tenantId)
                            .filter((i) => i.status !== "Paid")
                            .map((invoice) => invoice.amount_to_paid)
                            .reduce((a, c) => {
                              return a + c;
                            }, 0)
                        )}
                      </TableCell>
                      <TableCell>
                        ₱
                        {fCurrency(
                          invoices
                            .filter((i) => i.tenant_id === tenantId)
                            .filter((i) => i.status !== "Paid")
                            .map((invoice) => invoice.received)
                            .reduce((a, c) => {
                              return a + c;
                            }, 0)
                        )}
                      </TableCell>
                      <TableCell>
                        ₱
                        {fCurrency(
                          invoices
                            .filter((i) => i.tenant_id === tenantId)
                            .filter((i) => i.status !== "Paid")
                            .map((invoice) => invoice.balance)
                            .reduce((a, c) => {
                              return a + c;
                            }, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
        </Dialog>
        {/* Pay Invoices */}
        <Dialog
          open={pay}
          onClose={() => {
            setPay(false);
            setItemArray([]);
            setRentAmount(0);
          }}
          maxWidth={"md"}
          fullWidth
          fullScreen={isDesktop ? false : true}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setPay(false);
                setItemArray([]);
                setRentAmount(0);
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Iconify icon="ep:close-bold" />
            </IconButton>
          </DialogTitle>
          <DialogContent
            style={{
              paddingTop: isDesktop === true ? 0 : 20,
            }}
          >
            <div>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Rental Balance Sheet
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                {tenantId &&
                  TENANTS.filter((t) => t.id === tenantId)[0].firstname +
                    " " +
                    TENANTS.filter((t) => t.id === tenantId)[0].lastname}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                As of {fDateWord(new Date())}
              </Typography>
              <Box
                component={Paper}
                sx={{ px: isDesktop === true ? 5 : 0, mb: 5, mt: 5 }}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const transactions = {
                      id: transactionId,
                      tenant_id: tenantId,
                      amount: e.target.amount.value,
                      description: e.target.note.value,
                      invoice: itemArray,
                      payment_method: "Cash",
                    };
                    await axios
                      .post(
                        CONFIG.API_URL + "/api/transactions/add",
                        transactions,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "accessToken"
                            )}`,
                          },
                        }
                      )
                      .then((res) => {
                        if (res.data.success) {
                          setSeverity("success");
                          setAlert(res.data.msg);
                          setReRender(!reRender);
                          return;
                        }
                      })
                      .catch((error) => {
                        if (error.response?.data?.success === false) {
                          setSeverity("error");
                          return setAlert(error.response.data.msg);
                        }
                        setSeverity("error");
                        console.log(error);
                        return setAlert("Something went wrong");
                      });

                    setPay(false);
                    setRentAmount(0);
                    setItemArray([]);
                    handleClick();
                  }}
                >
                  <div style={{ display: "none" }}>
                    <Receipt
                      ref={receiptRef}
                      items={itemArray}
                      tenant={
                        tenantId &&
                        TENANTS.filter((t) => t.id === tenantId)[0].firstname +
                          " " +
                          TENANTS.filter((t) => t.id === tenantId)[0].lastname
                      }
                      receiptNo={transactionId}
                    />
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack>
                        <Typography variant="body1">
                          <strong>Payment For</strong>
                        </Typography>
                        {invoices
                          .filter((i) => i.tenant_id === tenantId)
                          .filter((i) => i.status !== "Paid")
                          .map((item) => {
                            return (
                              <FormControlLabel
                                key={item.id}
                                value="start"
                                control={<Checkbox />}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRentAmount(rentAmount + item.balance);
                                    setItemArray((current) => [
                                      ...current,
                                      item,
                                    ]);
                                  } else {
                                    setRentAmount(rentAmount - item.balance);
                                    setItemArray(
                                      itemArray.filter((i) => i.id !== item.id)
                                    );
                                  }
                                }}
                                label={`${item.payment_for} for ${
                                  item.payment_for.toLowerCase() === "rent"
                                    ? fDateWord(item.due_date)
                                    : fMonthandYear(item.due_date)
                                }`}
                                labelPlacement="end"
                              />
                            );
                          })}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack>
                        <TextField
                          name="amount"
                          label="Amount"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₱
                              </InputAdornment>
                            ),
                          }}
                          value={rentAmount}
                          readOnly={true}
                        />

                        <TextField
                          multiline
                          rows={5}
                          label="Note"
                          sx={{ mt: 2 }}
                          name="note"
                        />
                        <Button
                          variant="contained"
                          sx={{ mt: 2, height: "3rem" }}
                          type="submit"
                          disabled={itemArray.length > 0 ? false : true}
                        >
                          Record Payment
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </div>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={Boolean(alert)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => {
            setAlert(null);
          }}
        >
          <Alert
            severity={severity}
            variant="filled"
            sx={{ width: "100%" }}
            onClose={() => {
              setAlert(null);
            }}
          >
            {alert}
          </Alert>
        </Snackbar>

        <UserListToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder="Search Tenants Name..."
        />

        <Scrollbar>
          <TableContainer style={{ padding: "0 12px" }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={TENANTS.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      firstname,
                      lastname,
                      stall,
                      rental_amount,
                      image,
                    } = row;
                    const name = firstname + " " + lastname;

                    return (
                      <TableRow
                        key={id}
                        tabIndex={-1}
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
                          onClick={() => {
                            navigate(`/tenants/${id}`);
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {isDesktop && (
                              <Avatar alt={name} src={image ? image : ""}>
                                {!image &&
                                  firstname[0].toUpperCase() +
                                    lastname[0].toUpperCase()}
                              </Avatar>
                            )}

                            <Typography variant="subtitle2">{name}</Typography>
                          </Stack>
                        </TableCell>

                        {!isMobile && (
                          <>
                            <TableCell align="left">
                              {stall ? stall : "--"}
                            </TableCell>
                            <TableCell align="left">
                              ₱{rental_amount ? fCurrency(rental_amount) : "--"}
                            </TableCell>
                          </>
                        )}
                        <TableCell align="left">
                          ₱
                          {fCurrency(
                            invoices.filter((i) => i.tenant_id === id).length >
                              1
                              ? invoices
                                  .filter((i) => i.tenant_id === id)
                                  .map((i) => i.balance)
                                  .reduce((total, current) => total + current)
                              : invoices.filter((i) => i.tenant_id === id)
                                  .length === 1
                              ? invoices
                                  .filter((i) => i.tenant_id === id)
                                  .map((i) => i.balance)
                              : 0
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {invoices.filter((i) => i.tenant_id === id).length >=
                            1 &&
                            invoices
                              .filter((i) => i.tenant_id === id)
                              .map((i) => i.balance)
                              .reduce((total, current) => total + current) >
                              0 && (
                              <ButtonGroup
                                orientation={
                                  isMobile ? "vertical" : "horizontal"
                                }
                              >
                                <Button
                                  variant="outlined"
                                  onClick={(e) => {
                                    setTenantId(id);
                                    setView(true);
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={(e) => {
                                    setTenantId(id);
                                    setTransactionId(
                                      id.slice(0, 7) +
                                        "-" +
                                        new Date()
                                          .getTime()
                                          .toString()
                                          .slice(8, 13)
                                    );
                                    setPay(true);
                                  }}
                                >
                                  Pay
                                </Button>
                              </ButtonGroup>
                            )}
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
                TENANTS.length > 0 ? (
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
        {TENANTS.length >= 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={TENANTS.length}
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
