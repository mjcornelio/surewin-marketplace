import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const TextArea = ({ type, placeholder, label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      placeholder={placeholder}
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched ? (meta.error ? meta.error : " ") : " "}
      multiline
      rows={5}
    />
  );
};

export default TextArea;
