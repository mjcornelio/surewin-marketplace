// ----------------------------------------------------------------------

export default function FormControl(theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          notchedOutline: {
            borderColor: "#EFF0F6",
            borderWidth: "1.5px",
          },
        },
      },
    },
  };
}
