import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";

import Page from "../../components/Page";
import AddParkingCollection from "../../layouts/parking/AddParkingCollection";

export default function AddParkingCollectionPage() {
  return (
    <Page title="Add Parking Collection">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 3 }}>
          Parking Collection
        </Typography>
        <Box
          sx={{ height: "10px", width: "100%", backgroundColor: "#77BCFD" }}
        />
        <Box
          style={{
            boxShadow:
              "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
            backgroundColor: "#FFFFFF",
            padding: "2rem .5rem ",
            minHeight: "75vh",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <AddParkingCollection />
          </Box>
        </Box>
      </Container>
    </Page>
  );
}