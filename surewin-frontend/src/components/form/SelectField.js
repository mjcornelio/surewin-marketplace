import React from "react";
import { useField } from "formik";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { fMonthandYear } from "src/utils/formatTime";

const SelectField = (props) => {
  const { label, data, setSelected, name, onClick, addOption, ...rest } = props;
  const [field, meta] = useField(props);
  let { value: selectedValue } = field;

  function _renderHelperText() {
    if (meta.touched) {
      if (meta.error) {
        return <FormHelperText>{meta.error}</FormHelperText>;
      }
      return <FormHelperText> </FormHelperText>;
    } else {
      if (meta.error) {
        return <FormHelperText>{meta.error}</FormHelperText>;
      }
      return <FormHelperText> </FormHelperText>;
    }
  }

  return (
    <Box>
      <FormControl
        {...rest}
        error={
          meta.touched
            ? meta.error
              ? Boolean(meta.error)
              : false
            : Boolean(meta.error)
        }
        fullWidth
        variant="outlined"
      >
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          onClick={onClick}
          {...field}
          value={selectedValue}
          id={label}
          name={name}
          label={label}
        >
          <MenuItem value={setSelected} sx={{ display: "none" }}>
            {setSelected}
          </MenuItem>
          {addOption && (
            <MenuItem value={addOption.label}>{addOption.label}</MenuItem>
          )}
          {data?.map((item, index) => {
            return item.label === "None" ? (
              <MenuItem value="" key={index} disabled>
                <strong>Select Option</strong>
              </MenuItem>
            ) : (
              <MenuItem
                key={index}
                value={item.id ? item.id : item.label ? item.label : item}
              >
                {item.name
                  ? item.name
                  : item.label
                  ? item.label
                  : item.unit_title
                  ? item.unit_title
                  : item.payment_for
                  ? item.payment_for + " for " + fMonthandYear(item.due_date)
                  : item.firstname
                  ? `${item.firstname} ${item.lastname}`
                  : item}
              </MenuItem>
            );
          })}
        </Select>
        {_renderHelperText()}
      </FormControl>
    </Box>
  );
};

export default SelectField;
