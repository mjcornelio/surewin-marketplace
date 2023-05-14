import PropTypes from "prop-types";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// components
import { BaseOptionChart } from "../../../components/chart";
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 322;
const IconStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  float: "right",
  marginRight: "20px",
  a: {
    textDecoration: "none",
    color: "#FC9B7C",
  },
  "& .hide": { visibility: "hidden", display: "flex", alignItems: "center" },
  "&:hover": {
    "& .hide": {
      visibility: "visible",
    },
  },
}));

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(5),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    display: "none",
  },
}));

// ----------------------------------------------------------------------

AppOccupancyReport.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function AppOccupancyReport({
  title,
  subheader,
  chartColors,
  chartData,
  ...other
}) {
  const theme = useTheme();

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "right" },

    plotOptions: {
      donut: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card {...other} sx={{ paddingBottom: "40px", backgroundColor: "#FAFAFF" }}>
      <CardHeader title={title} subheader={subheader} />

      <ChartWrapperStyle dir="ltr">
        <Grid container>
          <Grid item md={6} xs={12}>
            <ReactApexChart
              type="donut"
              series={chartSeries}
              options={chartOptions}
              height={280}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid
              container
              sx={{
                padding: "40px 40px 0 40px",
                "@media (max-width: 500px)": {
                  display: "none",
                },
              }}
            >
              {chartData.map((data) => {
                return (
                  <Grid item xs={4} md={12} key={data.label}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "2em",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="data-legends-span"
                        style={{
                          backgroundColor: chartColors[chartData.indexOf(data)],
                          width: "5px",
                          height: "30px",
                          marginRight: "1em",
                        }}
                      ></div>
                      <Typography
                        variant="body2"
                        className="data-lagends"
                        key={data.label}
                      >
                        {data.value} {data.label}
                      </Typography>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </ChartWrapperStyle>
      <IconStyle>
        <Link
          variant="subtitle2"
          underline="hover"
          to="/property-units"
          style={{ zIndex: 5 }}
        >
          <Typography
            variant="subtitle2"
            sx={{ display: "flex", alignItems: "center" }}
          >
            View
            <span className="hide">
              <Iconify
                icon="charm:chevron-right"
                style={{
                  fontSize: "20px",
                }}
              />
            </span>
          </Typography>
        </Link>
      </IconStyle>
    </Card>
  );
}
