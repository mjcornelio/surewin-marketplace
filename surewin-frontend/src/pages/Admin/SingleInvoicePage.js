import React, { useState, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import {
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Stack,
  Modal,
} from "@mui/material";

import { fDateNumber, fDateTimeSuffix } from "../../utils/formatTime";
import Logo from "../../components/Logo";
import { fCurrency } from "../../utils/formatNumber";
import Paypal from "src/components/Paypal";

import Page from "../../components/Page";
import { useSearchParams, useParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { CONFIG } from "src/config/config";

export default function SingleInvoicePage() {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("tenant");
  const invoiceId = useParams();
  const [tenant, setTENANT] = useState(null);
  // eslint-disable-next-line
  const [contract, setContract] = useState(null);
  const [invoices, setInvoices] = useState([]);
  // eslint-disable-next-line
  const [unit, setUnit] = useState(null);
  // eslint-disable-next-line
  const [value, setValue] = React.useState(0);
  const [amount, setAmount] = useState(null);
  const [paymentFor, setPaymentFor] = useState(null);
  const componentRef = React.createRef();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
      const tenantUrl = CONFIG.API_URL + "/api/tenants/" + id;
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([axios.get(tenantUrl, headers)])
        .then(
          axios.spread((res1) => {
            if (res1.data.success) {
              const { tenant, contract, invoices, unit } = res1.data.data;
              setTENANT(tenant);

              setContract(contract);
              setInvoices(invoices.find((i) => i.id === invoiceId.id));
              return setUnit(unit);
            }
          })
        )
        .catch((error) => {
          if (error.response?.data?.success === false) {
            console.log(error);
          }
          console.log(error);
          return;
        });
    };

    fetchData();
  });
  return (
    <Page
      title={`${tenant ? `${tenant.firstname} ${tenant.lastname}` : "Tenant"}`}
    >
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
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h3">Pay Using Paypal</Typography>
          <Typography variant="body1">You can Pay Using Paypal</Typography>
          <Stack direction="column" spacing={2} mt={2}>
            <Stack sx={{ textAlign: "left", mt: 2 }}>
              <Typography variant="h6">Summary:</Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 1 }}
              >
                <Typography variant="h6">Payment For: </Typography>
                <Typography variant="body2">{paymentFor}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Total: </Typography>
                <Typography variant="body2">{amount} </Typography>
              </Stack>
            </Stack>

            <Paypal
              amount={amount}
              invoice_id={invoices?.id}
              tenant_id={tenant?.id}
            />
          </Stack>
        </Box>
      </Modal>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 2 }}>
          Invoices
        </Typography>
        <Box
          sx={{ height: "10px", width: "100%", backgroundColor: "#77BCFD" }}
        />
        <Box
          style={{
            boxShadow:
              "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
            backgroundColor: "#FFFFFF",
            padding: "2rem",
            minHeight: "75vh",
          }}
        >
          <div ref={componentRef}>
            <Box
              sx={{
                px: 5,
                position: "relative",
              }}
            >
              <Logo src="logo.png" sx={{ width: 80, position: "absolute" }} />
              <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
                R & A Surewin Marketplace
              </Typography>
              <Typography
                variant="body1"
                textAlign={"center"}
                sx={{ fontSize: "12px" }}
              >
                <strong>Address:</strong> Tunkong Manga, City of San Jose Del
                Monte, Bulacan, 3023
              </Typography>
              <Typography
                variant="body1"
                textAlign={"center"}
                sx={{ fontSize: "12px" }}
              >
                {fDateTimeSuffix(Date.now())}
              </Typography>
              <Grid container sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <Grid container>
                    {!Array.isArray(tenant) && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                          >
                            Invoiced To:
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px" }}
                          >
                            {tenant
                              ? tenant.firstname + " " + tenant.lastname
                              : "--"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px" }}
                          >
                            {tenant?.contact_number}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px" }}
                          >
                            {`${
                              tenant?.street_address
                                ? tenant.street_address
                                : "--"
                            }, ${tenant?.barangay ? tenant.barangay : "--"}, ${
                              tenant?.city ? tenant.city : "--"
                            }, ${tenant?.province ? tenant.province : "--"}, ${
                              tenant?.zip ? tenant.zip : "--"
                            }`}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ mt: 5 }}>
                  <Box
                    sx={{
                      height: "2px",
                      width: "100%",
                      backgroundColor: "#CFD3DC",
                    }}
                  />

                  {!Array.isArray(invoices) && (
                    <>
                      <Grid container sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                          <Typography variant="h5">Invoice No:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            #{invoices.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TableContainer component={Paper} sx={{ mt: 5 }}>
                            <Table
                              aria-label="simple table"
                              sx={{
                                ".MuiTableCell-root": {
                                  p: 1,
                                  fontSize: "10px",
                                },
                              }}
                            >
                              <TableHead>
                                <TableRow
                                  sx={{
                                    borderRadius: "50px 50px 50px 50px",
                                    backgroundColor: "#e6e6ff",
                                  }}
                                >
                                  <TableCell>Due Date</TableCell>
                                  <TableCell>Payment For</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Amount To Be Paid</TableCell>
                                  <TableCell>Received</TableCell>
                                  <TableCell>Balance</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow style={{ height: "100px" }}>
                                  <TableCell>
                                    {fDateNumber(invoices.due_date)}
                                  </TableCell>
                                  <TableCell>{invoices.payment_for}</TableCell>
                                  <TableCell>{invoices.description}</TableCell>
                                  <TableCell>{invoices.status}</TableCell>
                                  <TableCell>
                                    ₱{fCurrency(invoices.amount_to_paid)}
                                  </TableCell>
                                  <TableCell>
                                    ₱{fCurrency(invoices.received)}
                                  </TableCell>
                                  <TableCell>
                                    ₱
                                    {fCurrency(
                                      invoices.amount_to_paid -
                                        invoices.received
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Box
                          sx={{
                            height: "2px",
                            width: "100%",
                            backgroundColor: "#CFD3DC",
                          }}
                        />
                      </Grid>
                      <Grid
                        container
                        sx={{ width: "200px", float: "right", mt: 2 }}
                      >
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                          >
                            Amount To Paid:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", float: "right" }}
                          >
                            ₱{fCurrency(invoices.amount_to_paid)}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                          >
                            Recieved:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", float: "right" }}
                          >
                            ₱{fCurrency(invoices.received)}
                          </Typography>
                        </Grid>
                        <Box
                          sx={{
                            height: "2px",
                            width: "100%",
                            backgroundColor: "#CFD3DC",
                            mt: 2,
                          }}
                        />
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                          >
                            Balance:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ pt: 1, fontSize: "12px", float: "right" }}
                          >
                            ₱{fCurrency(invoices.balance)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  sx={{
                    pt: 1,
                    fontSize: "12px",

                    mt: 4,
                  }}
                >
                  <strong>Note:</strong> This is computer generated invoice and
                  does not require physical signature.
                </Typography>
              </Grid>
            </Box>
          </div>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ mt: 5, px: 5 }}
            spacing={2}
          >
            <Button
              variant="outlined"
              startIcon={
                <Iconify
                  icon="fluent:print-20-regular"
                  sx={{ fontSize: "1.5rem" }}
                />
              }
              onClick={handlePrint}
            >
              Print
            </Button>

            {id === JSON.parse(localStorage.getItem("user")).id
              ? invoices.received !== invoices.amount_to_paid && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpen(true);
                      setAmount(invoices.amount_to_paid - invoices.received);
                      setPaymentFor(
                        invoices.payment_for +
                          " " +
                          fDateNumber(invoices.due_date)
                      );
                      return;
                    }}
                  >
                    Pay Now
                  </Button>
                )
              : invoices.received !== invoices.amount_to_paid && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(
                        "/transactions/add?tenant=" +
                          id +
                          "&invoice=" +
                          invoices.id
                      );
                    }}
                  >
                    Record Payment
                  </Button>
                )}
          </Stack>
        </Box>
      </Container>
    </Page>
  );
}
