import React from "react";
import { Container, Typography, Box } from "@mui/material";

import Page from "../../components/Page";
import GenerateReport from "../../layouts/reporting/GenerateReport";

export default function ReportsPage() {
  return (
    <Page title="Reports">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 3 }}>
          Reports
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
          <Typography variant="h5">Generate Report</Typography>
          <Typography variant="body2">
            Configure the information needed for reporting
          </Typography>
          <GenerateReport />
        </Box>
      </Container>
    </Page>
  );
}
