import { filter } from "lodash";
import { useState } from "react";
import axios from "axios";

import useResponsive from "../../hooks/useResponsive";
import { useNavigate, useLocation } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";

// material
import {
  Table,
  Stack,
  Avatar,
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
} from "@mui/material";

// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { useEffect } from "react";
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

export default function TenantsList() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  // eslint-disable-next-line
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("firstname");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [TENANTS, setTENANTS] = useState([]);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const isMobile = useResponsive("down", "md");
  const [pageLoading, setPageLoading] = useState(false);
  // eslint-disable-next-line
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { currentUser },
  } = useValue();
  let TABLE_HEAD = [
    { id: "firstname", label: "Tenants Name", alignRight: false },
    { id: "stall", label: "Unit/s", alignRight: false },
    { id: "contact_number", label: "Contact Number", alignRight: false },
    { id: "email", label: "Email Address", alignRight: false },
    { id: "deposit", label: "Deposit", alignRight: false },
    { id: "action", label: "", alignRight: true },
  ];

  if (isMobile) {
    TABLE_HEAD = [
      { id: "firstname", label: "Tenants Name", alignRight: false },
      { id: "stall", label: "Unit/s", alignRight: false },
      { id: "action", label: "", alignRight: true },
    ];
  }
  // eslint-disable-next-line
  useEffect(() => {
    setPageLoading(true);
    if (location?.state?.alert) {
      setAlert(location.state.alert);
      setSeverity(location.state.severity);
      window.history.replaceState({}, document.title);
    }
    const fetchData = async () => {
      const tenantsUrl = CONFIG.API_URL + "/api/tenants",
        unitsUrl = CONFIG.API_URL + "/api/property-units";
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([axios.get(tenantsUrl, headers), axios.get(unitsUrl, headers)])
        .then(
          axios.spread((res1, res2) => {
            if (res1.data.success && res2.data.success) {
              setPageLoading(false);
              setTENANTS(
                res1.data.tenants.filter(
                  (item) => item.account_status !== "archived"
                )
              );
              setUnits(res2.data.units);
            }
          })
        )
        .catch((error) => {
          if (error.response?.data?.success === false) {
            setPageLoading(false);
            setSeverity("error");
            return setAlert(error.response.data.msg);
          }
          setPageLoading(false);
          setSeverity("error");
          return setAlert("Something went wrong");
        });
    };

    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

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
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder="Search Tenants Name..."
          btn={currentUser.user_role === "admin" ? "Add Tenant" : null}
          to="/tenants/add"
        />

        <Scrollbar>
          <TableContainer style={{ padding: "0 12px" }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={TENANTS.length}
                numSelected={selected.length}
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
                      contact_number,
                      email,
                      deposit,
                      image,
                    } = row;
                    const name = firstname + " " + lastname;
                    // const isItemSelected = selected.indexOf(name) !== -1;

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
                            {!isMobile && (
                              <Avatar alt={name} src={image ? image : ""}>
                                {!image &&
                                  firstname[0].toUpperCase() +
                                    lastname[0].toUpperCase()}
                              </Avatar>
                            )}

                            <Typography variant="subtitle2">{name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {stall ? stall : "--"}
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell align="left">
                              {contact_number ? contact_number : "--"}
                            </TableCell>
                            <TableCell align="left">
                              {email ? email : "--"}
                            </TableCell>
                            <TableCell align="left">
                              {deposit > 0 ? deposit : "--"}
                            </TableCell>
                          </>
                        )}

                        <TableCell align="right">
                          <Button onClick={(e) => navigate("/tenants/" + id)}>
                            View
                          </Button>
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
