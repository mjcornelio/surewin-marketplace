import PropTypes from "prop-types";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
// @mui
import { Card, CardHeader, Box } from "@mui/material";
// components
import { BaseOptionChart } from "../../../components/chart";
import { fCurrency } from "src/utils/formatNumber";

// ----------------------------------------------------------------------

AppMonthlyParkingRecord.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppMonthlyParkingRecord({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}) {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: "datetime" },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `₱${fCurrency(y.toFixed(0))}`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
