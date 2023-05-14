// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[2],
          borderRadius: "5px",
          position: "relative",
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h4" },
        subheaderTypographyProps: { variant: "body2" },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 3),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
