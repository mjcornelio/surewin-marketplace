import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const InputFields = ({ type, placeholder, initialValue, label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      placeholder={placeholder}
      {...field}
      {...props}
      onWheelCapture={(e) => e.target.blur()}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched ? (meta.error ? meta.error : " ") : " "}
    />
  );
};

export default InputFields;
