import PropTypes from "prop-types";
// icons
import { Icon, disableCache } from "@iconify/react";
// @mui
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};
disableCache("all");

export default function Iconify({ icon, sx, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
