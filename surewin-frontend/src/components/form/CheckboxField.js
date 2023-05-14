import React, { useState } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useField } from "formik";

function CheckboxField({ label, ...props }) {
  const [field] = useField(props);
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(!checked);
  };

  return (
    <FormControlLabel
      label={label}
      style={{ color: "gray" }}
      value={checked}
      control={
        <Checkbox
          onChange={handleChange}
          value={checked}
          {...field}
          {...props}
        />
      }
    />
  );
}

export default CheckboxField;
