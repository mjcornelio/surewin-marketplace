import PropTypes from "prop-types";
import axios from "axios";
// @mui
import { Card, CardHeader, Typography, Box, Divider } from "@mui/material";

import { useState, useEffect } from "react";

import InvoiceList from "src/layouts/invoices/InvoiceList";
import { CONFIG } from "src/config/config";
// ----------------------------------------------------------------------

RentalReport.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function RentalReport({ title, subheader, ...other }) {
  const [invoices, setInvoices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const invoicesUrl =
        CONFIG.API_URL +
        "/api/invoices/" +
        JSON.parse(localStorage.getItem("user")).id;
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([axios.get(invoicesUrl, headers)])
        .then(
          axios.spread((res1) => {
            if (res1.data.success) {
              setInvoices(res1.data.invoices);
              return;
            }
          })
        )
        .catch((error) => {
          if (error.response?.data?.success === false) {
            console.log(error);
          }
          return;
        });
    };

    fetchData();
  }, []);

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          sx={{ paddingBottom: "24px" }}
        />
        <Box
          style={{
            padding: "30px",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h6" sx={{ paddingBottom: "16px" }}>
            Unsettled Payments
          </Typography>
          <Divider />

          {invoices && (
            <InvoiceList
              invoices={invoices.filter((i) => i.status !== "Paid")}
              user="tenant"
            />
          )}
        </Box>
      </Card>
    </>
  );
}
