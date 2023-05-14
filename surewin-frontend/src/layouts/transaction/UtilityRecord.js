import React from "react";
import { filter } from "lodash";
import { useState } from "react";
import axios from "axios";

import useResponsive from "../../hooks/useResponsive";
import { useNavigate } from "react-router-dom";

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
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Paper,
  InputAdornment,
  Grid,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// components
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { CONFIG } from "../../config/config";
import { fDate, fDateNumber, fDateWord } from "src/utils/formatTime";
import { fCurrency } from "src/utils/formatNumber";
import Iconify from "src/components/Iconify";
import { Box } from "@mui/system";
import Logo from "src/components/Logo";
import { useEffect } from "react";

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
// eslint-disable-next-line
const Receipt = React.forwardRef((props, ref) => {
  const { tenant, items } = props;

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
        Tunkong Manga, City of San Jose Del Monte, Bulacan, 3023
      </Typography>
      <Box sx={{ height: "2px", width: "100%", backgroundColor: "#000000" }} />
      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        {fDate(new Date())}
      </Typography>
      <Typography variant="body1" textAlign={"center"} sx={{ fontSize: "8px" }}>
        {tenant}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "10px", mt: 2 }}>
        <strong>
          Payment For
          <span style={{ float: "right" }}>Amount</span>
        </strong>
      </Typography>
      {items.map((i) => {
        return (
          <div key={i.id}>
            <Typography variant="body1" sx={{ fontSize: "8px" }}>
              {i.payment_for} for {fDateNumber(i.due_date)}
              <span style={{ float: "right" }}>
                {fCurrency(i.amount_to_paid)}
              </span>
            </Typography>
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
                ? items.map((i) => i.amount_to_paid).reduce((t, c) => t + c)
                : items[0]?.amount_to_paid
            )}
          </span>
        </strong>
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

export default function RentTransactions({ TENANTS, setReRender, reRender }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstname");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMobile = useResponsive("down", "md");
  // eslint-disable-next-line
  const [pageLoading, setPageLoading] = useState(false);

  const [tenantId, setTenantId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [electric, setElectric] = useState(true);
  const [water, setWater] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [value, setValue] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const [recordElectric, setRecordElectric] = useState(false);
  const [electricRate, setElectricRate] = useState(0);
  const [electricMeter, setElecricMeter] = useState(null);
  const [electricInitial, setElectricInitial] = useState(null);
  const [electricTotal, setElectricTotal] = useState(0);
  const [electricReadDate, setElectricReadDate] = useState(null);

  const [recordWater, setRecordWater] = useState(false);
  const [waterRate, setWaterRate] = useState(0);
  const [waterMeter, seWaterMeter] = useState(null);
  const [waterInitial, setWaterInitial] = useState(null);
  const [waterTotal, setWaterTotal] = useState(0);
  const [waterReadDate, setWaterReadDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      return await axios
        .get(CONFIG.API_URL + "/api/utility", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setElectricRate(res.data.utility[0].electricity_rate);
            setWaterRate(res.data.utility[0].water_rate);
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
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  let TABLE_HEAD = [
    { id: "name", label: "Tenants Name", alignRight: false },
    { id: "stall", label: "Unit/s", alignRight: false },
    { id: "meter", label: "Meter No.", alignRight: false },
    { id: "actions", label: " " },
  ];
  if (isMobile) {
    TABLE_HEAD = [
      { id: "name", label: "Tenants Name", alignRight: false },
      { id: "actions", label: " " },
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

        {/* Record Electricity */}
        <Dialog
          open={recordElectric}
          onClose={() => {
            setRecordElectric(false);
            setElectricTotal(0);
          }}
          maxWidth={"md"}
          fullWidth
          fullScreen={isDesktop ? false : true}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setRecordElectric(false);
                setElectricTotal(0);
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
                Electricity Bill
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
                    const bill = {
                      tenant_id: tenantId,
                      electric_initial_reading: e.target.current_reading.value,
                      electric_last_reading: new Date(),
                      cost: e.target.cost.value,
                      monthOf: value,
                    };
                    await axios
                      .patch(CONFIG.API_URL + "/api/bill/electricity", bill, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      })
                      .then((res) => {
                        if (res.data.success) {
                          setSeverity("success");
                          setAlert(res.data.msg);
                          setElectricTotal(0);
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
                    setRecordElectric(false);
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="meter"
                        label="Mater No."
                        value={electricMeter}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="initial_reading"
                        label="Last Reading"
                        value={electricInitial}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="initial_reading"
                        label="Last Read On"
                        value={fDateWord(electricReadDate)}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="current_reading"
                        label="Current Reading"
                        placeholder="Enter Current Reading"
                        onChange={(e) =>
                          setElectricTotal(e.target.value - electricInitial)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="kwh"
                        label="Total kwh consumption"
                        value={electricTotal}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        name="cost"
                        label="Total Cost"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₱</InputAdornment>
                          ),
                        }}
                        value={electricTotal ? electricTotal * electricRate : 0}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          openTo="month"
                          views={["month", "year"]}
                          name="yearAndmonth"
                          label="For Month and Year"
                          value={value}
                          onChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              helperText={null}
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ m: "auto", height: "3rem" }}
                        type="submit"
                        disabled={
                          electricTotal > 0 && value !== null ? false : true
                        }
                      >
                        Record
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </div>
          </DialogContent>
        </Dialog>

        {/* Record Water */}
        <Dialog
          open={recordWater}
          onClose={() => {
            setRecordWater(false);
            setWaterTotal(0);
          }}
          maxWidth={"md"}
          fullWidth
          fullScreen={isDesktop ? false : true}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => {
                setRecordWater(false);
                setWaterTotal(0);
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
                Water Bill
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
                    const bill = {
                      tenant_id: tenantId,
                      water_initial_reading: e.target.current_reading.value,
                      water_last_reading: new Date(),
                      cost: e.target.cost.value,
                      monthOf: value,
                    };
                    await axios
                      .patch(CONFIG.API_URL + "/api/bill/water", bill, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      })
                      .then((res) => {
                        if (res.data.success) {
                          setSeverity("success");
                          setAlert(res.data.msg);
                          setWaterTotal(0);
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
                    setRecordWater(false);
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name="meter"
                        label="Mater No."
                        value={waterMeter}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="initial_reading"
                        label="Last Reading"
                        value={waterInitial}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="initial_reading"
                        label="Last Read On"
                        value={fDateWord(waterReadDate)}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="current_reading"
                        label="Current Reading"
                        placeholder="Enter Current Reading"
                        onChange={(e) =>
                          setWaterTotal(e.target.value - waterInitial)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="kwh"
                        label="Total kwh consumption"
                        value={waterTotal}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="cost"
                        label="Total Cost"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₱</InputAdornment>
                          ),
                        }}
                        value={waterTotal ? waterTotal * waterRate : 0}
                        readOnly={true}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          openTo="month"
                          views={["month", "year"]}
                          name="yearAndmonth"
                          label="For Month and Year"
                          value={value}
                          placeholder={"Payment for what month"}
                          onChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              helperText={null}
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ m: "auto", height: "3rem" }}
                        type="submit"
                        disabled={
                          waterTotal > 0 && value !== null ? false : true
                        }
                      >
                        Record
                      </Button>
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
            <Box sx={{ width: "100%", mb: 1 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "100%",
                      p: 2,
                      borderRadius: 0,
                    }}
                    variant={electric ? "outlined" : "contained"}
                    onClick={(e) => {
                      setElectric(true);
                      setWater(false);
                    }}
                  >
                    Electricity Billing
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "100%",
                      p: 2,
                      borderRadius: 0,
                    }}
                    variant={water ? "outlined" : "contained"}
                    onClick={() => {
                      setWater(true);
                      setElectric(false);
                    }}
                  >
                    Water Billing
                  </Button>
                </Grid>
              </Grid>
            </Box>
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
                      electric_meter,
                      water_meter,
                      electric_initial_reading,
                      electric_last_reading,
                      water_initial_reading,
                      water_last_reading,
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
                            <Avatar alt={name} src={image ? image : ""}>
                              {!image &&
                                firstname[0].toUpperCase() +
                                  lastname[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle2">{name}</Typography>
                          </Stack>
                        </TableCell>

                        {!isMobile && (
                          <TableCell align="left">
                            {stall ? stall : "--"}
                          </TableCell>
                        )}

                        {electric && (
                          <>
                            {!isMobile && (
                              <TableCell align="left">
                                {electric_meter ? electric_meter : "--"}
                              </TableCell>
                            )}

                            <TableCell align="left">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setRecordElectric(true);
                                  setElecricMeter(electric_meter);
                                  setElectricInitial(electric_initial_reading);
                                  setElectricReadDate(electric_last_reading);
                                  setTenantId(id);
                                }}
                              >
                                Record
                              </Button>
                            </TableCell>
                          </>
                        )}
                        {water && (
                          <>
                            {!isMobile && (
                              <TableCell align="left">
                                {water_meter ? water_meter : "--"}
                              </TableCell>
                            )}

                            <TableCell align="left">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setRecordWater(true);
                                  seWaterMeter(water_meter);
                                  setWaterInitial(water_initial_reading);
                                  setWaterReadDate(water_last_reading);
                                  setTenantId(id);
                                }}
                              >
                                Record
                              </Button>
                            </TableCell>
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
