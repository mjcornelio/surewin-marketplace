import React, { useState, useEffect } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { Box, Typography, Grid, Container, Button, Stack } from "@mui/material";

import {
  fDateNumber,
  fDateTimeSuffix,
  fMonthandYear,
} from "../../utils/formatTime";
import Logo from "../../components/Logo";
import { fCurrency } from "../../utils/formatNumber";

import Page from "../../components/Page";
import { useSearchParams, useParams } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { CONFIG } from "src/config/config";

export default function SingleInvoicePage() {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("tenant");
  const transactionId = useParams();
  const [tenant, setTENANT] = useState(null);
  // eslint-disable-next-line
  const [contract, setContract] = useState(null);
  const [transactions, setTransactions] = useState([0]);
  const [invoices, setInvoices] = useState([]);
  // eslint-disable-next-line
  const [unit, setUnit] = useState(null);
  // eslint-disable-next-line
  const [value, setValue] = React.useState(0);
  const componentRef = React.createRef();
  // eslint-disable-next-line
  const [open, setOpen] = useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: transactions.id,
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
              const { tenant, contract, transactions, invoices, unit } =
                res1.data.data;
              setTENANT(tenant);
              setContract(contract);
              setTransactions(
                transactions.find((i) => i.id === transactionId.id)
              );
              setInvoices(invoices);
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
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 2 }}>
          Transactions
        </Typography>

        <Box
        // style={{
        //   boxShadow:
        //     "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
        //   backgroundColor: "#ffffff",
        //   padding: "2rem",
        // }}
        >
          <div ref={componentRef}>
            <Box
              sx={{
                height: "10px",
                backgroundColor: "#77BCFD",
                width: "400px",
                m: "auto",
              }}
            />
            <Box
              sx={{
                boxShadow:
                  "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
                p: 5,
                width: "400px",
                position: "relative",
                m: "auto",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                variant="body1"
                textAlign={"center"}
                sx={{ fontSize: "15px", pt: 2 }}
              >
                <Logo src="logo.png" sx={{ width: 50, m: "auto" }} />
                <strong>R & A Surewin Marketplace</strong>
              </Typography>
              <Typography
                variant="body1"
                textAlign={"center"}
                sx={{ fontSize: "10px" }}
              >
                Tungkong Manga, City of San Jose Del Monte, Bulacan, 3023
              </Typography>
              <Typography
                variant="body1"
                textAlign={"center"}
                sx={{ fontSize: "10px" }}
              >
                {fDateTimeSuffix(Date.now())}
              </Typography>
              <Grid container sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  {!Array.isArray(tenant) && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {tenant ? tenant.firstname + " " + tenant.lastname : "--"}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      height: "2px",
                      width: "100%",
                      backgroundColor: "#000000",
                    }}
                  />
                  <Typography
                    variant="body1"
                    textAlign={"center"}
                    sx={{ fontSize: "15px", pt: 2 }}
                  >
                    <strong>Receipt Payment</strong>
                  </Typography>

                  {!Array.isArray(transactions) && invoices && (
                    <Grid container sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontSize: "12px" }}>
                          <strong>Transaction Number:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontSize: "12px" }}>
                          {transactions.id}
                        </Typography>
                      </Grid>
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            <strong>Payment For:</strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            {
                              invoices.find(
                                (i) => i.id === transactions.invoice_id
                              ).payment_for
                            }
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            <strong>Month and Year of Billing:</strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            {fMonthandYear(
                              invoices.find(
                                (i) => i.id === transactions.invoice_id
                              ).due_date
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            <strong>Payment Date:</strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            {fDateNumber(transactions.payment_date)}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            <strong>Payment Method:</strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            {transactions.payment_method
                              ? transactions.payment_method
                              : "--"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            <strong>Payment Amount:</strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontSize: "12px" }}>
                            {fCurrency(transactions.received_amount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      pt: 1,
                      fontSize: "12px",

                      mt: 4,
                    }}
                  >
                    <strong>Note:</strong> This is computer generated receipt
                    and does not require physical signature.
                  </Typography>
                </Grid>
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
          </Stack>
        </Box>
      </Container>
    </Page>
  );
}
