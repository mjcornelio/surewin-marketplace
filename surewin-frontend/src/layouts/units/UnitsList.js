import { filter } from "lodash";
import { useState } from "react";
import axios from "axios";
import { CONFIG } from "../../config/config";

// material
import {
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fCurrency } from "src/utils/formatNumber";
import useResponsive from "src/hooks/useResponsive";
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

export default function ManagersList() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");
  // eslint-disable-next-line
  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("unit_title");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [UNITS, setUNITS] = useState([]);
  const [alert, setAlert] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useResponsive("down", "md");

  let TABLE_HEAD = [
    { id: "unit_title", label: "Unit Title", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "rent", label: "Rent Per Day", alignRight: false },
    { id: "action", label: "", alignRight: true },
  ];
  if (isMobile) {
    TABLE_HEAD = [
      { id: "unit_title", label: "Unit Title", alignRight: false },
      { id: "status", label: "Status", alignRight: false },
      { id: "action", label: "", alignRight: true },
    ];
  }

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      axios
        .get(CONFIG.API_URL + "/api/property-units", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setPageLoading(false);
            setUNITS(res.data.units.sort());
          }
        })
        .catch((error) => {
          if (error.response?.data?.success === false) {
            setPageLoading(false);
            return setAlert(error.response.data.msg);
          }
          setPageLoading(false);
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

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = UNITS.map((n) => n.unit_title);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - UNITS.length) : 0;

  const filteredUsers = applySortFilter(
    UNITS,
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
        <UserListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder="Search Unit Number..."
          btn="Add Unit"
          to="/property-units/add"
        />

        <Scrollbar>
          <TableContainer style={{ padding: "0 12px" }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={UNITS.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, status, rental_amount, unit_title } = row;
                    const isItemSelected = selected.indexOf(unit_title) !== -1;

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
                        onClick={() => navigate("/property-units/" + id)}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ cursor: "pointer" }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {unit_title}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{status}</TableCell>
                        {!isMobile && (
                          <TableCell align="left">
                            ₱{fCurrency(rental_amount)}
                          </TableCell>
                        )}

                        <TableCell align="right">
                          <Button
                            onClick={() => navigate("/property-units/" + id)}
                          >
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
                UNITS.length > 0 ? (
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

        {UNITS.length >= 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={UNITS.length}
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
