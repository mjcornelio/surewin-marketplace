import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { useValue } from "../../context/ContextProvider";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Drawer,
  Typography,
  Avatar,
  Divider,
  Slide,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";

// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Logo from "../../components/Logo";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
//
import navConfig from "./NavConfig";
import { CONFIG } from "src/config/config";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
    zIndex: 2,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  const {
    state: { currentUser },
  } = useValue();
  const avatarURL =
    currentUser.user_role === "tenants" ? "/tenants/" : "/users/";
  /* eslint-disable */
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);
  /* eslint-enable */
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, width: "100%" }}>
        <Logo src="favicon.ico" sx={{ width: 80, margin: "auto" }} />
      </Box>

      <Box sx={{ mb: 5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            {currentUser.image ? (
              <Avatar src={currentUser.image} alt="photo" />
            ) : (
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                src={currentUser.image}
                alt="photo"
              >
                {currentUser.firstname.split("")[0] +
                  currentUser.lastname.split("")[0]}
              </Avatar>
            )}

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#EFF0F6" }}>
                {`${currentUser.firstname} ${currentUser.lastname}`}
              </Typography>
              <Typography variant="body2" sx={{ color: "#BABDD7" }}>
                {currentUser.user_role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
        <Divider />
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Slide
      in
      timeout={{ enter: 300 }}
      mountOnEnter
      unmountOnExit
      direction="right"
    >
      <RootStyle>
        {!isDesktop && (
          <Drawer
            open={isOpenSidebar}
            onClose={onCloseSidebar}
            PaperProps={{
              sx: { width: DRAWER_WIDTH, bgcolor: "#000D6B" },
            }}
          >
            {renderContent}
          </Drawer>
        )}

        {isDesktop && (
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: DRAWER_WIDTH,
                bgcolor: "#000D6B",
                borderRightStyle: "dashed",
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </RootStyle>
    </Slide>
  );
}
