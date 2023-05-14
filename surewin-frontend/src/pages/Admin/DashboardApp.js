import React, { useState, useEffect } from "react";
import axios from "axios";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography, Slide } from "@mui/material";
// components
import Page from "../../components/Page";
import { useValue } from "../../context/ContextProvider";
// sections
import {
  AppOccupancyReport,
  AppMonthlyParkingRecord,
  AppWidgetSummary,
  AppTransactions,
} from "../../sections/@dashboard/app";
import { CONFIG } from "src/config/config";

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const [vacant, setVacant] = useState([]);
  const [occupied, setOccupied] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [parkingCollections, setParkingCollections] = useState([]);

  const {
    state: { currentUser },
  } = useValue();

  useEffect(() => {
    const unitsUrl = CONFIG.API_URL + "/api/property-units",
      parkingCollectionsUrl = CONFIG.API_URL + "/api/parking_collections";
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const fetchData = async () => {
      return await axios
        .all([
          axios.get(unitsUrl, headers),
          axios.get(parkingCollectionsUrl, headers),
        ])
        .then(
          axios.spread((res1, res2) => {
            if (res1.data.success) {
              setVacant(
                res1.data.units.filter((unit) => {
                  return unit.status === "vacant";
                })
              );
              setOccupied(
                res1.data.units.filter((unit) => {
                  return unit.status === "occupied";
                })
              );
              setUnavailable(
                res1.data.units.filter((unit) => {
                  return unit.status === "unavailable";
                })
              );
            }
            if (res2.data.success) {
              setParkingCollections(res2.data.parkingCollections);
            }
          })
        )
        .catch((error) => console.log(error));
    };
    fetchData();
  }, []);

  const totalParking = (month) => {
    const total = parkingCollections
      ?.filter((p) => new Date(p.payment_date).getMonth() + 1 === month)
      ?.map((p) => p.received_amount);
    if (total.length > 0) {
      return total.reduce((t, c) => t + c);
    } else {
      return 0;
    }
  };
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        {currentUser?.user_role === "admin" && (
          <Grid container spacing={3}>
            <Slide
              direction="up"
              in
              timeout={{ enter: 400 }}
              mountOnEnter
              unmountOnExit
            >
              <Grid item xs={12} md={8}>
                <AppOccupancyReport
                  title={`Welcome Back, ${currentUser.firstname}`}
                  subheader="This is your property rental occupancy report"
                  chartData={[
                    {
                      label: "Unavailable",
                      value: unavailable ? unavailable.length : 0,
                    },
                    { label: "Vacant", value: vacant ? vacant.length : 0 },
                    {
                      label: "Occupied",
                      value: occupied ? occupied.length : 0,
                    },
                  ]}
                  chartColors={[
                    theme.palette.chart.brown[0],
                    theme.palette.chart.blue[0],
                    theme.palette.chart.red[1],
                  ]}
                />
              </Grid>
            </Slide>
            <Grid item md={4} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Slide
                    direction="up"
                    in
                    timeout={{ enter: 400 }}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid item>
                      <AppWidgetSummary icon={"uiw:user-add"} />
                    </Grid>
                  </Slide>
                </Grid>
                <Grid item xs={12}>
                  <Slide
                    direction="up"
                    in
                    timeout={{ enter: 400 }}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid item>
                      <AppTransactions icon={"mdi:philippine-peso"} />
                    </Grid>
                  </Slide>
                </Grid>
              </Grid>
            </Grid>

            <Slide
              direction="up"
              in
              timeout={{ enter: 600 }}
              mountOnEnter
              unmountOnExit
            >
              <Grid item xs={12} md={8} lg={8}>
                <AppMonthlyParkingRecord
                  title="Monthly Parking Record"
                  chartLabels={[
                    `01/01/${new Date().getFullYear()}`,
                    `02/01/${new Date().getFullYear()}`,
                    `03/01/${new Date().getFullYear()}`,
                    `04/01/${new Date().getFullYear()}`,
                    `05/01/${new Date().getFullYear()}`,
                    `06/01/${new Date().getFullYear()}`,
                    `07/01/${new Date().getFullYear()}`,
                    `08/01/${new Date().getFullYear()}`,
                    `09/01/${new Date().getFullYear()}`,
                    `10/01/${new Date().getFullYear()}`,
                    `11/01/${new Date().getFullYear()}`,
                    `12/01/${new Date().getFullYear()}`,
                  ]}
                  chartData={[
                    {
                      name: "Collection",
                      type: "column",
                      fill: "solid",
                      data: [
                        totalParking(1),
                        totalParking(2),
                        totalParking(3),
                        totalParking(4),
                        totalParking(5),
                        totalParking(6),
                        totalParking(7),
                        totalParking(8),
                        totalParking(9),
                        totalParking(10),
                        totalParking(11),
                        totalParking(12),
                      ],
                    },
                  ]}
                />
              </Grid>
            </Slide>
          </Grid>
        )}
        {/* {currentUser?.user_role === "tenant" && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RentalReport
                title={`Welcome Back, ${currentUser.firstname}`}
                subheader="This is your rental report"
              />
            </Grid>
          </Grid>
        )} */}
        {/* {currentUser?.user_role === "manager" && (
          <Grid>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Grid item xs={12}>
                  <Slide
                    direction="up"
                    in
                    timeout={{ enter: 400 }}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid item>
                      <AppTransactions icon={"mdi:philippine-peso"} />
                    </Grid>
                  </Slide>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <UnpaidTenants
                title={`Unpaid Tenants`}
                amount={500}
                date={Date()}
              />
            </Grid>
          </Grid>
        )} */}
      </Container>
    </Page>
  );
}
