import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import parse from "html-react-parser";
import axios from "axios";
import {
  Grid,
  Snackbar,
  Alert,
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogTitle,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import * as Yup from "yup";

import SelectField from "../../components/form/SelectField";
import DatePicker from "../../components/form/DatePicker";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";

import {
  TenantStatement,
  TenantTransactions,
  CollectionSummary,
} from "../../utils/generatePdf";
import Loader from "src/pages/Admin/Loader";
import { CONFIG } from "src/config/config";

const validationSchema = Yup.object({
  report_type: Yup.string().required("Please provide a Report Type"),
  tenant: Yup.string(),
  data_range: Yup.string(),
  start: Yup.date().typeError("Invalid Date"),
  end: Yup.date().typeError("Invalid Date"),
});

const GenerateReport = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [tenants, setTenants] = useState([]);
  const [finish, setFinish] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");
  const tenantId = searchParams.get("tenant");
  const [range, setRange] = useState(null);
  const [reportType, setReportType] = useState("Total Collection");
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const tenantStatementRef = React.createRef();
  const tenantTransactionRef = React.createRef();
  const collectionSummaryRef = React.createRef();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectTenant, setSelectTenant] = useState("All Tenants");
  const [choose, setChosen] = useState(["rent"]);
  const [pageLoading, setPageLoading] = useState(false);
  const [parking, setParking] = useState([]);
  const [view, setView] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const [openView, setOpenView] = useState(false);
  const handleClose = () => {
    setSelectTenant("All Tenants");
    setOpen(false);
    setChosen(["rent"]);
    setStart(null);
    setEnd(null);
    setReportType("Total Collection");
  };
  const handlePrint = useReactToPrint({
    content: () =>
      reportType === "Tenant Transactions"
        ? tenantTransactionRef.current
        : reportType === "Tenant Rental Statement"
        ? tenantStatementRef.current
        : collectionSummaryRef.current,
  });

  const handleView = () => {
    let report =
      reportType === "Tenant Transactions"
        ? tenantTransactionRef.current
        : reportType === "Tenant Rental Statement"
        ? tenantStatementRef.current
        : collectionSummaryRef.current;

    setOpenView(true);
    return setView(report);
  };

  useEffect(() => {
    const fetchData = async () => {
      return await axios
        .get(CONFIG.API_URL + "/api/tenants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setTenants(res.data.tenants);
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
    };
    fetchData();
  }, [finish]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
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

      {pageLoading && <Loader />}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 6,
            borderRadius: "8px",
            width: "500px",
            "@media (max-width: 600px)": {
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0",
            },
            margin: "auto",
            textAlign: "center",
          }}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
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
          <object
            data="/illustrations/undraw_completed_re_cisp.svg"
            width={200}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
            Successfully Generate Report
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 400 }}>
            You can now view the document or print directly to the browser
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleView}>
              View
            </Button>
            {isDesktop && (
              <Button variant="contained" onClick={handlePrint}>
                Print
              </Button>
            )}
          </Stack>
        </Box>
      </Modal>
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth={"lg"}
        fullWidth
        fullScreen={isDesktop ? false : true}
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenView(false)}
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
        <DialogContent sx={{ width: "100%", mb: 5 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {view && parse(view.outerHTML)}
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ display: "none" }}>
        <TenantStatement
          start={start}
          end={end}
          tenant={
            tenantId
              ? tenants.find((tenant) => tenant.id === tenantId)
              : selectTenant !== "All Tenants"
              ? tenants.find((tenant) => tenant.id === selectTenant)
              : tenants
          }
          invoices={invoices}
          ref={tenantStatementRef}
        />
        <TenantTransactions
          start={start}
          end={end}
          tenant={
            tenantId
              ? tenants.find((tenant) => tenant.id === tenantId)
              : selectTenant !== "All Tenants"
              ? tenants.find((tenant) => tenant.id === selectTenant)
              : tenants
          }
          transactions={transactions}
          ref={tenantTransactionRef}
        />
        <CollectionSummary
          start={start}
          end={end}
          choose={choose}
          transactions={transactions}
          ref={collectionSummaryRef}
          setChosen={setChosen}
          parking={parking}
        />
      </div>
      {!finish ? (
        <MultiStepForm
          initialValues={{
            report_type: type || "Total Collection",
            tenant: "All Tenants",
            date_range: "Current Day",
            start: "",
            end: "",
          }}
          onSubmit={(values) => {
            setPageLoading(true);
            if (values.report_type === "Total Collection") {
              setReportType("Total Collection");
              if (choose.find((c) => c === "parking")) {
                axios
                  .get(CONFIG.API_URL + "/api/parking_collections/", {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    if (res.data.success) {
                      if (values.date_range === "Custom") {
                        setParking(
                          res.data.parkingCollections.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                new Date(values.start).getTime() &&
                              new Date(t.payment_date).getTime() <=
                                new Date(values.end).getTime()
                            );
                          })
                        );
                      } else if (values.date_range === "Current Day") {
                        setParking(
                          res.data.parkingCollections.filter((t) => {
                            return (
                              new Date(t.payment_date).toDateString() ===
                              new Date().toDateString()
                            );
                          })
                        );
                      } else if (values.date_range === "Current Year") {
                        const date_today = new Date();
                        const fday = new Date(date_today.getFullYear(), 0);

                        setParking(
                          res.data.parkingCollections.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                      } else if (values.date_range === "Current Month") {
                        const date_today = new Date();
                        const fday = new Date(
                          date_today.getFullYear(),
                          date_today.getMonth(),
                          1
                        );

                        setParking(
                          res.data.parkingCollections.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                      } else {
                        setParking(res.data.parkingCollections);
                      }
                    }
                  })
                  .catch((error) => {
                    if (error.response?.data?.success === false) {
                      console.log(error);
                    }
                    console.log(error);
                    return;
                  });
              }
              const transactionsURL = CONFIG.API_URL + "/api/transactions";
              axios
                .get(transactionsURL, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                    "Content-Type": "application/json",
                  },
                })
                .then((res) => {
                  if (res.data.success) {
                    if (res.data.transactions.length > 0) {
                      if (values.date_range === "Custom") {
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                new Date(values.start).getTime() &&
                              new Date(t.payment_date).getTime() <=
                                new Date(values.end).getTime()
                            );
                          })
                        );

                        setStart(values.end);
                        setEnd(values.start);
                      } else if (values.date_range === "Current Day") {
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).toDateString() ===
                              new Date().toDateString()
                            );
                          })
                        );

                        setStart(new Date());
                        setEnd(new Date());
                      } else if (values.date_range === "Current Year") {
                        const date_today = new Date();
                        const fday = new Date(date_today.getFullYear(), 0);
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );

                        setStart(date_today);
                        setEnd(fday);
                      } else if (values.date_range === "Current Month") {
                        const date_today = new Date();
                        const fday = new Date(
                          date_today.getFullYear(),
                          date_today.getMonth(),
                          1
                        );
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );

                        setStart(date_today);
                        setEnd(fday);
                      } else {
                        setTransactions(res.data.transactions);
                      }
                    }
                    setOpen(true);
                    setPageLoading(false);
                    setFinish(true);
                    return;
                  }
                })
                .catch((error) => {
                  if (error.response?.data?.success === false) {
                    setSeverity("error");
                    setPageLoading(false);
                    return setAlert(error.response.data.msg);
                  }
                  setSeverity("error");
                  setPageLoading(false);
                  return setAlert("Something went wrong");
                });

              setRange(false);
            } else if (values.report_type === "Tenant Transactions") {
              setReportType("Tenant Transactions");
              const singleTenatURL =
                CONFIG.API_URL + "/api/transactions/" + values.tenant;
              const multiTenatURL = CONFIG.API_URL + "/api/transactions/";
              axios
                .get(
                  values.tenant === "All Tenants"
                    ? multiTenatURL
                    : singleTenatURL,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  if (res.data.success) {
                    if (res.data.transactions.length > 0) {
                      if (values.date_range === "Custom") {
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                new Date(values.start).getTime() &&
                              new Date(t.payment_date).getTime() <=
                                new Date(values.end).getTime()
                            );
                          })
                        );
                        setStart(values.end);
                        setEnd(values.start);
                      } else if (values.date_range === "Current Day") {
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).toDateString() ===
                              new Date().toDateString()
                            );
                          })
                        );
                        setStart(new Date());
                        setEnd(new Date());
                      } else if (values.date_range === "Current Year") {
                        const date_today = new Date();
                        const fday = new Date(date_today.getFullYear(), 0);
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                        setStart(date_today);
                        setEnd(fday);
                      } else if (values.date_range === "Current Month") {
                        const date_today = new Date();
                        const fday = new Date(
                          date_today.getFullYear(),
                          date_today.getMonth(),
                          1
                        );
                        setTransactions(
                          res.data.transactions.filter((t) => {
                            return (
                              new Date(t.payment_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.payment_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                        setStart(date_today);
                        setEnd(fday);
                      } else {
                        setTransactions(res.data.transactions);
                      }
                      setOpen(true);
                      setPageLoading(false);
                    } else {
                      setSeverity("warning");
                      setPageLoading(false);
                      return setAlert("There is no current transactions");
                    }
                    setFinish(true);
                    return;
                  }
                })
                .catch((error) => {
                  if (error.response?.data?.success === false) {
                    setSeverity("error");
                    setPageLoading(false);
                    return setAlert(error.response.data.msg);
                  }
                  setSeverity("error");
                  setPageLoading(false);
                  return setAlert("Something went wrong");
                });
              setRange(false);
            } else if (values.report_type === "Tenant Rental Statement") {
              setReportType("Tenant Rental Statement");
              const singleTenatURL =
                CONFIG.API_URL + "/api/invoices/" + values.tenant;
              const multiTenatURL = CONFIG.API_URL + "/api/invoices/";
              axios
                .get(
                  values.tenant === "All Tenants"
                    ? multiTenatURL
                    : singleTenatURL,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  if (res.data.success) {
                    if (res.data.invoices.length > 0) {
                      if (values.date_range === "Custom") {
                        setInvoices(
                          res.data.invoices?.filter((i) => {
                            return (
                              new Date(i.due_date).getTime() >=
                                new Date(values.start).getTime() &&
                              new Date(i.due_date).getTime() <=
                                new Date(values.end).getTime()
                            );
                          })
                        );
                        setStart(values.end);
                        setEnd(values.start);
                      } else if (values.date_range === "Current Day") {
                        setTransactions(
                          res.data.invoices?.filter((t) => {
                            return (
                              new Date(t.payment_date).toDateString() ===
                              new Date().toDateString()
                            );
                          })
                        );
                        setStart(new Date());
                        setEnd(new Date());
                      } else if (values.date_range === "Current Year") {
                        const date_today = new Date();
                        const fday = new Date(date_today.getFullYear(), 0);
                        setInvoices(
                          res.data.invoices?.filter((t) => {
                            return (
                              new Date(t.due_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.due_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                        setStart(date_today);
                        setEnd(fday);
                      } else if (values.date_range === "Current Month") {
                        const date_today = new Date();
                        const fday = new Date(
                          date_today.getFullYear(),
                          date_today.getMonth(),
                          1
                        );
                        setInvoices(
                          res.data.invoices?.filter((t) => {
                            return (
                              new Date(t.due_date).getTime() >=
                                fday.getTime() &&
                              new Date(t.due_date).getTime() <=
                                date_today.getTime()
                            );
                          })
                        );
                        setStart(date_today);
                        setEnd(fday);
                      } else {
                        setInvoices(res.data.invoices);
                      }
                      setPageLoading(false);
                      setOpen(true);
                    } else {
                      setSeverity("warning");
                      setPageLoading(false);
                      return setAlert("There is no current rental statement");
                    }
                    setFinish(true);
                    return;
                  }
                })
                .catch((error) => {
                  if (error.response?.data?.success === false) {
                    setSeverity("error");
                    setPageLoading(false);
                    return setAlert(error.response.data.msg);
                  }
                  setSeverity("error");
                  setPageLoading(false);
                  console.log(error);
                  return setAlert("Something went wrong");
                });
              setRange(false);
            }
          }}
          type="transaction"
          lastbtn="Generate"
        >
          <FormStep
            stepName="Report Info"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={validationSchema}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <SelectField
                  name="report_type"
                  label="Report Type"
                  onClick={(e) => {
                    setReportType(e.target.innerText);
                  }}
                  setSelected={type}
                  data={[
                    { label: "Total Collection" },
                    { label: "Tenant Transactions" },
                    { label: "Tenant Rental Statement" },
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                {reportType === "Total Collection" && (
                  <FormControl
                    component="fieldset"
                    variant="standard"
                    sx={{ width: "100%" }}
                    onChange={(e) =>
                      setChosen(
                        choose.find((c) => c === e.target.name)
                          ? choose.filter((c) => c !== e.target.name)
                          : [...choose, e.target.name]
                      )
                    }
                  >
                    <FormLabel component="legend">Choose Reports</FormLabel>
                    <FormGroup
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        mb: 2,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <FormControlLabel
                        control={<Checkbox name="rent" defaultChecked />}
                        label="Rent"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        control={<Checkbox name="electricity bill" />}
                        label="Electricity"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        control={<Checkbox name="water bill" />}
                        label="Water"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        control={<Checkbox name="parking" />}
                        label="Parking"
                        labelPlacement="bottom"
                      />
                      <FormControlLabel
                        control={<Checkbox name="others" />}
                        label="Others"
                        labelPlacement="bottom"
                      />
                    </FormGroup>
                  </FormControl>
                )}
              </Grid>
              {reportType !== "Total Collection" && (
                <Grid item xs={12}>
                  <SelectField
                    onClick={(e) => setSelectTenant(e.target.dataset.value)}
                    name="tenant"
                    label="Tenants Name"
                    addOption={{ label: "All Tenants" }}
                    setSelected={tenantId}
                    data={tenants.length > 0 ? tenants : [{ label: "None" }]}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <SelectField
                  name="date_range"
                  label="Date Range"
                  onClick={(e) => {
                    setRange(e.target.innerText);
                  }}
                  data={[
                    { label: "Current Day" },
                    { label: "Current Month" },
                    { label: "Current Year" },
                    { label: "All Time" },
                    { label: "Custom" },
                  ]}
                  fullWidth
                />
              </Grid>
              {range === "Custom" && (
                <>
                  <Grid item xs={12} md={6}>
                    <DatePicker name="start" label="Start Date" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker name="end" label="End Date" />
                  </Grid>
                </>
              )}
            </Grid>
          </FormStep>
        </MultiStepForm>
      ) : (
        setTimeout(() => {
          setFinish(false);
        }, 50)
      )}
    </div>
  );
};

export default GenerateReport;
