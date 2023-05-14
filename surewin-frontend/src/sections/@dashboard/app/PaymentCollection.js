import PropTypes from "prop-types";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader, Grid, Typography } from "@mui/material";
// components
import { BaseOptionChart } from "../../../components/chart";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 322;

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

PaymentCollection.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function PaymentCollection({
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
    <Card
      {...other}
      sx={{ paddingBottom: "40px", backgroundColor: "#FAFAFF", boxShadow: "0" }}
    >
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
            <Grid container sx={{ padding: "40px 40px 0 40px" }}>
              {chartData.map((data) => {
                return (
                  <Grid item xs={6} md={12} key={data.label}>
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
                        {`${data.value} ${data.label}`}
                      </Typography>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </ChartWrapperStyle>
    </Card>
  );
}
