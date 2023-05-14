import React, { useState, useEffect } from "react";
import { useField } from "formik";
import { Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

function DatePicker(props) {
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;
  const { value } = field;
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
    }
  }, [value]);

  function _onChange(date) {
    if (date) {
      setSelectedDate(date);
      try {
        const ISODateString = date.toISOString();
        setValue(ISODateString);
      } catch (error) {
        setValue(date);
      }
    } else {
      setValue(date);
    }
  }

  return (
    <Grid container>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          {...field}
          {...props}
          value={selectedDate}
          onChange={_onChange}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              fullWidth
              {...params}
              error={
                meta.touched
                  ? meta.error
                    ? true
                    : false
                  : meta.error
                  ? true
                  : false
              }
              helperText={
                meta.touched
                  ? meta.error
                    ? meta.error
                    : " "
                  : meta.error
                  ? meta.error
                  : " "
              }
            />
          )}
        />
      </LocalizationProvider>
    </Grid>
  );
}

export default DatePicker;
