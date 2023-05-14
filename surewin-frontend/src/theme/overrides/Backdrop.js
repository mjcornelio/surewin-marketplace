import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Backdrop(theme) {
  const varLow = alpha(theme.palette.grey[900], 0.2);
  const varHigh = alpha(theme.palette.grey[900], 0.6);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [
            "#bdbdbd",
            `-moz-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          ],
          "&.MuiBackdrop-invisible": {
            background: "transparent",
          },
        },
      },
    },
  };
}
