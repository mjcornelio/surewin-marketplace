// form
import { Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
};
export default function RHFTextField({ name, ...other }) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          sx={{ padding: "10px 0" }}
          {...field}
          fullWidth
          value={
            typeof field.value === "number" && field.value === 0
              ? ""
              : field.value
          }
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
