import React from "react";
import { useField } from "formik";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { useEffect } from "react";

const MultipleSelectField = (props) => {
  const {
    readonly,
    label,
    data,
    setSelected,
    name,
    onClick,
    setData,
    addOption,
    setRent,
    rentHolder,
    electric,
    setElectricMeter,
    water,
    setWaterMeter,
    disabled,
    ...rest
  } = props;
  const [multiple, setMultiple] = React.useState([]);
  const [field, meta, { setValue }] = useField(props);

  useEffect(() => {
    if (setSelected) {
      setMultiple(setSelected);
    }
  }, [setSelected]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMultiple(typeof value === "string" ? value.split(",") : value);
    setValue(value);
    setData(value);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setElectricMeter(electric);
    setWaterMeter(water);
    setRent(rentHolder);
  };

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
          inputProps={{ readOnly: readonly }}
          disabled={disabled}
          {...field}
          value={multiple}
          placeholder={`shit`}
          id={label}
          name={name}
          label={label}
          onChange={handleChange}
          onClick={handleClick}
          multiple
          renderValue={(selected) => selected.join(", ")}
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
              <MenuItem key={index} value={item.unit_title}>
                <Checkbox checked={multiple.indexOf(item.unit_title) > -1} />
                <ListItemText primary={item.unit_title} />
              </MenuItem>
            );
          })}
        </Select>
        {_renderHelperText()}
      </FormControl>
    </Box>
  );
};

export default MultipleSelectField;
