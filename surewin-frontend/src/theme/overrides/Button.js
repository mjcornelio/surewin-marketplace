// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            boxShadow: "none",
            opacity: "0.9",
          },
        },
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          color: theme.palette.grey[800],
          boxShadow: theme.customShadows.z8,
          "&:hover": {
            backgroundColor: theme.palette.grey[400],
          },
        },
        containedPrimary: {
          boxShadow: theme.customShadows.z1,
          backgroundColor: "#003A6B",
          "&:hover": {
            backgroundColor: "#103996",
          },
        },
        containedSecondary: {
          boxShadow: theme.customShadows.z1,
          backgroundColor: "#055C9D",
        },
        outlinedInherit: {
          border: `1px solid #003A6B`,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        outlinedPrimary: {
          color: "#003A6B",
          border: `1px solid #003A6B`,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
