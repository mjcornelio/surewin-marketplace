import React from "react";
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
} from "@mui/material";

import { fDateNumber, fDateTimeSuffix, fMonthandYear } from "./formatTime";
import Logo from "../components/Logo";
import { fCurrency } from "./formatNumber";
import Tenants from "src/pages/Admin/TenantsPage";

export const TenantStatement = React.forwardRef(
  ({ invoices, tenant, start, end }, ref) => {
    invoices = invoices.sort((a, b) => {
      if (a.due > b.due_date) {
        return -1;
      } else if (a.due_date < b.due_date) {
        return 1;
      } else {
        return 0;
      }
    });

    return (
      <div ref={ref} style={{ position: "relative", width: "100%" }}>
        <Box
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
            position: "relative",
          }}
        >
          <Logo
            src="logo.png"
            sx={{
              width: 80,
              position: "absolute",
              "@media (max-width:700px)": {
                position: "relative",
                m: "auto",
              },
            }}
          />
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            R & A Surewin Marketplace
          </Typography>
          <Typography
            variant="body1"
            textAlign={"center"}
            sx={{ fontSize: "12px" }}
          >
            <strong>Address:</strong> Tungkong Mangga, City of San Jose Del
            Monte, Bulacan, 3023
          </Typography>
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            Tenant Rental Statement
          </Typography>
          <Grid container sx={{ mt: 3 }} spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid container>
                {!Array.isArray(tenant) && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {tenant
                          ? tenant.firstname + " " + tenant.lastname
                          : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {tenant?.contact_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {`${
                          tenant?.street_address ? tenant.street_address : "--"
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
            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Begins:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {end ? fDateNumber(end) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Ends:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {start ? fDateNumber(start) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Printed:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {fDateTimeSuffix(Date.now())}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
          }}
        >
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
                {Array.isArray(tenant) ? (
                  <>
                    <TableCell>Payers Name</TableCell>
                    <TableCell>Stall</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Payment For</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                  </>
                )}

                <TableCell>Amount To Be Paid</TableCell>
                <TableCell>Received</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(tenant) &&
                tenant.map((t) => {
                  const invoice = invoices.filter((item) => {
                    return item.tenant_id === t.id;
                  });
                  return (
                    <TableRow key={t.id}>
                      {Array.isArray(tenant) && (
                        <TableCell>{t.firstname + " " + t.lastname}</TableCell>
                      )}
                      <TableCell>{t.stall}</TableCell>
                      <TableCell>
                        {fCurrency(
                          invoice
                            .map((item) => {
                              return item.amount_to_paid;
                            })
                            .reduce((t, c) => t + c, 0)
                        )}
                      </TableCell>
                      <TableCell>
                        {fCurrency(
                          invoice
                            .map((item) => {
                              return item.received;
                            })
                            .reduce((t, c) => t + c, 0)
                        )}
                      </TableCell>
                      <TableCell>
                        {fCurrency(
                          invoice
                            .map((item) => {
                              return item.balance;
                            })
                            .reduce((t, c) => t + c, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!Array.isArray(tenant) &&
                invoices.map((item) => {
                  return (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor: item.balance > 0 ? "#c8e6c9" : "",
                      }}
                    >
                      <TableCell>{item.payment_for}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>₱{fCurrency(item.amount_to_paid)}</TableCell>
                      <TableCell>₱{fCurrency(item.received)}</TableCell>
                      <TableCell>
                        ₱{fCurrency(item.amount_to_paid - item.received)}
                      </TableCell>
                    </TableRow>
                  );
                })}

              <TableRow>
                <TableCell colSpan={Array.isArray(tenant) ? 2 : 3}></TableCell>
                <TableCell>
                  ₱
                  {fCurrency(
                    invoices
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
    );
  }
);
export const TenantTransactions = React.forwardRef(
  ({ transactions, tenant, start, end }, ref) => {
    transactions = transactions.sort((a, b) => {
      if (a.payment_date > b.payment_date) {
        return -1;
      } else if (a.payment_date < b.payment_date) {
        return 1;
      } else {
        return 0;
      }
    });

    return (
      <div ref={ref} style={{ position: "relative", width: "100%" }}>
        <Box
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
            position: "relative",
          }}
        >
          <Logo
            src="logo.png"
            sx={{
              width: 80,
              position: "absolute",
              "@media (max-width:700px)": {
                position: "relative",
                m: "auto",
              },
            }}
          />
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            R & A Surewin Marketplace
          </Typography>
          <Typography
            variant="body1"
            textAlign={"center"}
            sx={{ fontSize: "12px" }}
          >
            <strong>Address:</strong> Tungkong Mangga, City of San Jose Del
            Monte, Bulacan, 3023
          </Typography>
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            Tenant Transactions
          </Typography>
          <Grid container sx={{ mt: 3 }} spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid container>
                {!Array.isArray(tenant) && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {tenant
                          ? tenant.firstname + " " + tenant.lastname
                          : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {tenant?.contact_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {`${
                          tenant?.street_address ? tenant.street_address : "--"
                        }, ${tenant?.barangay ? tenant.barangay : "--"}, ${
                          tenant?.city ? tenant.city : "--"
                        }, ${tenant?.province ? tenant.province : "--"}, ${
                          tenant?.zip ? tenant.zip : "--"
                        }`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        Start of Lease:{" "}
                        {tenant ? fDateNumber(tenant.start_date) : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        End of Lease:{" "}
                        {tenant ? fDateNumber(tenant.end_date) : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{ pt: 1, fontSize: "12px", fontWeight: "bold" }}
                      >
                        {tenant?.stall}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Begins:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {end ? fDateNumber(end) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Ends:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {start ? fDateNumber(start) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Printed:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {fDateTimeSuffix(Date.now())}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
          }}
        >
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
                {Array.isArray(tenant) && (
                  <>
                    <TableCell>Payers Name</TableCell>
                    <TableCell>Start Lease</TableCell>
                    <TableCell>End Lease</TableCell>
                    <TableCell>Stall</TableCell>
                  </>
                )}

                <TableCell>Invoice Number</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Payment For</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount Received</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((item) => {
                return (
                  <TableRow key={item.id}>
                    {Array.isArray(tenant) && (
                      <>
                        <TableCell>
                          {tenant?.find((t) => t.id === item.tenant_id)
                            ?.firstname +
                            " " +
                            tenant?.find((t) => t.id === item.tenant_id)
                              ?.lastname}
                        </TableCell>
                        <TableCell>
                          {tenant?.find((t) => t.id === item.tenant_id)
                            ?.start_date
                            ? fDateNumber(
                                tenant?.find((t) => t.id === item.tenant_id)
                                  ?.start_date
                              )
                            : "--"}
                        </TableCell>
                        <TableCell>
                          {tenant?.find((t) => t.id === item.tenant_id)
                            ?.end_date
                            ? fDateNumber(
                                tenant?.find((t) => t.id === item.tenant_id)
                                  ?.end_date
                              )
                            : "--"}
                        </TableCell>
                        <TableCell>
                          {tenant?.find((t) => t.id === item.tenant_id)?.stall}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{item.invoice_id}</TableCell>
                    <TableCell>{fDateTimeSuffix(item.payment_date)}</TableCell>
                    <TableCell>
                      {item.payment_for.toLowerCase() === "rent"
                        ? `${item.payment_for} for ${fDateNumber(
                            item.due_date
                          )}`
                        : `${item.payment_for} for ${fMonthandYear(
                            item.due_date
                          )}`}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>₱{fCurrency(item.received_amount)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={Array.isArray(tenant) ? 8 : 4}></TableCell>
                <TableCell>
                  ₱
                  {fCurrency(
                    transactions
                      .map((transaction) => transaction.received_amount)
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
    );
  }
);
export const CollectionSummary = React.forwardRef(
  ({ transactions, start, end, choose, parking }, ref) => {
    transactions = transactions.sort((a, b) => {
      if (a.payment_date > b.payment_date) {
        return -1;
      } else if (a.payment_date < b.payment_date) {
        return 1;
      } else {
        return 0;
      }
    });

    const totalRent = transactions
      .filter((t) => t.payment_for.toLowerCase() === "rent")
      .map((t) => t.received_amount)
      .reduce((t, c) => t + c, 0);
    const totalOthers = transactions
      .filter(
        (t) =>
          t.payment_for.toLowerCase() !== "electricity bill" &&
          t.payment_for.toLowerCase() !== "water bill" &&
          t.payment_for.toLowerCase() !== "rent"
      )
      .map((t) => t.received_amount)
      .reduce((t, c) => t + c, 0);
    const totalElectricity = transactions
      .filter((t) => t.payment_for.toLowerCase() === "electricity bill")
      .map((t) => t.received_amount)
      .reduce((t, c) => t + c, 0);
    const totalWater = transactions
      .filter((t) => t.payment_for.toLowerCase() === "electricity bill")
      .map((t) => t.received_amount)
      .reduce((t, c) => t + c, 0);
    const totalParking = parking
      .map((p) => p.received_amount)
      .reduce((t, c) => t + c, 0);

    let total = 0;
    if (choose.find((c) => c === "rent")) {
      total += totalRent;
    }
    if (choose.find((c) => c === "electricity bill")) {
      total += totalElectricity;
    }
    if (choose.find((c) => c === "water bill")) {
      total += totalWater;
    }
    if (choose.find((c) => c === "others")) {
      total += totalOthers;
    }
    if (choose.find((c) => c === "parking")) {
      total += totalParking;
    }

    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
            position: "relative",
          }}
        >
          <Logo
            src="logo.png"
            sx={{
              width: 80,
              position: "absolute",
              "@media (max-width:700px)": {
                position: "relative",
                m: "auto",
              },
            }}
          />
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            R & A Surewin Marketplace
          </Typography>
          <Typography
            variant="body1"
            textAlign={"center"}
            sx={{ fontSize: "12px" }}
          >
            <strong>Address:</strong> Tungkong Mangga, City of San Jose Del
            Monte, Bulacan, 3023
          </Typography>
          <Typography variant="h3" textAlign={"center"} sx={{ pt: 2 }}>
            Total Collection Report
          </Typography>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Begins:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {end ? fDateNumber(end) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Statement Date Ends:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {start ? fDateNumber(start) : "All Time"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    Printed:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ pt: 1, fontSize: "12px" }}>
                    {fDateTimeSuffix(Date.now())}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            px: 5,
            mt: 5,
            "@media (max-width:500px)": {
              px: 0,
            },
          }}
        >
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
                <TableCell>Collections For</TableCell>
                <TableCell>Received Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {choose.map((item) => {
                return (
                  <TableRow key={item}>
                    <TableCell>
                      <Typography variant="body1">
                        {item.toUpperCase()}
                      </Typography>
                    </TableCell>

                    {item === "parking" ? (
                      <TableCell>
                        <Typography variant="body1">
                          ₱{fCurrency(totalParking)}
                        </Typography>
                      </TableCell>
                    ) : item === "others" ? (
                      <TableCell>
                        <Typography variant="body1">
                          ₱{fCurrency(totalOthers)}
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Typography variant="body1">
                          ₱
                          {fCurrency(
                            item === "electricity bill"
                              ? totalElectricity
                              : item === "water bill"
                              ? totalWater
                              : totalRent
                          )}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell>
                  <Typography variant="body1">
                    <strong>Total</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    <strong>₱{fCurrency(total)}</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
);

// export async function generateTenantsStatement(data, content) {
//   const doc = new jsPDF();
//   const snapshot = await html2canvas(content);
//   const img = snapshot.toDataUrl("img/png");
//   const imgProperties = doc.getImageProperties(img);
//   const pdfWidth = doc.internal.pageSize.getWidth();
//   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
//   doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
//   doc.html(content, {
//     callback: function (doc) {
//       doc.save("download.pdf");
//     },
//   });
//   console.log(document.getElementById("content"));
//   // doc.save("tenant_statement_report");
//   return;
// }
