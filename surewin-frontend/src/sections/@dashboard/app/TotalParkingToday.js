// @mui
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Card, Typography, CardHeader } from "@mui/material";
import Iconify from "src/components/Iconify";
import { fDateWord } from "../../../utils/formatTime";

// ----------------------------------------------------------------------
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

AppWidgetSummary.propTypes = {
  date: PropTypes.string,
  amount: PropTypes.number,
  title: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({
  title,
  subheader,
  amount,
  date,
  color = "primary",
  sx,
  ...other
}) {
  return (
    <Card
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: "FFFFFF",
        paddingBottom: "30px",
        mt: "80px",
        mb: "50px",
        mx: 5,

        ...sx,
      }}
      {...other}
    >
      <CardHeader title={title} subheader={subheader} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: " 0 20px",
          marginTop: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h2">₱{amount}</Typography>
        <Typography variant="body2">{fDateWord(date)}</Typography>
      </div>

      <IconStyle>
        <Link variant="subtitle2" underline="hover" to="/payments" style={{}}>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", mt: 5 }}
          >
            View Details
            <span className="hide">
              <Iconify
                icon="charm:chevron-right"
                style={{
                  fontSize: "30px",
                }}
              />
            </span>
          </Typography>
        </Link>
      </IconStyle>
    </Card>
  );
}
