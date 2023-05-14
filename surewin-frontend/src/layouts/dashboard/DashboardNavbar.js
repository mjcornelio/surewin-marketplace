import PropTypes from "prop-types";
// material
import { alpha, styled } from "@mui/material/styles";
import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
// components
import Iconify from "../../components/Iconify";
//
import AccountPopover from "./AccountPopover";

//utils

import { fDate } from "src/utils/formatTime";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 60;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(3px)",
  zIndex: 2,
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
  borderBottom: "1px solid black",
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: "text.primary", display: { lg: "none" } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Typography variant="body1" sx={{ color: "#000000" }}>
          {fDate(Date.now())}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <AccountPopover />
      </ToolbarStyle>
    </RootStyle>
  );
}
