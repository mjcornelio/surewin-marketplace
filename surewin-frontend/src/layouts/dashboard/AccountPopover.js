import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
// components
import MenuPopover from "../../components/MenuPopover";
import { CONFIG } from "src/config/config";

import { useValue } from "../../context/ContextProvider";
import { deepOrange } from "@mui/material/colors";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    linkTo: "/",
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
    linkTo: "/settings",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();
  const avatarURL =
    currentUser.user_role === "tenants" ? "/tenants/" : "/users/";
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = () => {
    dispatch({ type: "UPDATE_USER", payload: "" });
    localStorage.setItem("user", null);
    localStorage.setItem("accessToken", null);
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              "&:before": {
                zIndex: 1,
                content: "''",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                position: "absolute",
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
              },
            }),
          }}
        >
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
        </IconButton>
      </Tooltip>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser.firstname + " " + currentUser.lastname}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {currentUser.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
