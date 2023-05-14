import { useNavigate } from "react-router-dom";
// @mui
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { Card, Tooltip, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../../utils/formatNumber";
// components
import Iconify from "../../../components/Iconify";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONFIG } from "src/config/config";

// ----------------------------------------------------------------------

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  ...other
}) {
  const [tenant, setTenant] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(CONFIG.API_URL + "/api/tenants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setTenant(res.data.tenants.length);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [tenant]);
  return (
    <Tooltip title="Tenants">
      <Card
        sx={{
          py: 3,
          cursor: "pointer",
          textAlign: "center",
          color: (theme) => theme.palette[color].darker,
          backgroundColor: "#FAFAFF",
          "&:hover": {
            opacity: "0.5",
          },
          ...sx,
        }}
        {...other}
        onClick={() => navigate("/tenants")}
      >
        <StyledIcon
          sx={{
            color: (theme) => theme.palette[color].dark,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette[color].dark,
                0
              )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
          }}
        >
          <Iconify icon={icon} width={24} height={24} />
        </StyledIcon>

        <Typography variant="h3">{fShortenNumber(tenant)}</Typography>
        <Typography variant="body1">Total Tenant</Typography>

        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {title}
        </Typography>
      </Card>
    </Tooltip>
  );
}
