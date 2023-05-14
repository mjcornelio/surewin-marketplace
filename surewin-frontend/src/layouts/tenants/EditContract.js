import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Grid,
  Typography,
  InputAdornment,
  Divider,
  TextField,
} from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import DatePicker from "../../components/form/DatePicker";
import SelectField from "../../components/form/SelectField";
import MultiStepForm, { FormStep } from "./MultiStepForm";
import MultipleSelectField from "../../components/form/MultipleSelectField";
import { CONFIG } from "src/config/config";

const EditTenants = ({ contract, onClose, setSeverity, setAlert, status }) => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [finish, setFinish] = useState(false);
  const [units, setUnits] = useState([]);
  const [data, setData] = useState();
  const [rentAmount, setRentAmount] = useState(contract?.rental_amount);
  useEffect(() => {
    const unitsUrl = CONFIG.API_URL + "/api/property-units";
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const fetchData = async () => {
      return await axios
        .all([axios.get(unitsUrl, headers)])
        .then(
          axios.spread((res1) => {
            setUnits(
              res1.data.units.filter(
                (unit) =>
                  unit.status === "vacant" ||
                  contract?.stall.split(",").some((c) => unit.unit_title === c)
              )
            );
          })
        )
        .catch((error) => console.log(error));
    };
    fetchData();
  });

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {!finish ? (
        <MultiStepForm
          initialValues={{
            stall: contract?.stall.split(",") || [],
            rent: contract?.rental_amount || "",
            startdate: contract?.start_date || "",
            enddate: contract?.end_date || "",
            frequency: contract?.rental_frequency || "",
            electric_meter: contract?.electric_meter || "",
            water_meter: contract?.water_meter || "",
            electric_initial_reading: contract?.electric_initial_reading || "",
            water_initial_reading: contract?.water_initial_reading || "",
            discount: contract?.discount || "",
            deposit: contract?.deposit || "",
            deposit_received: contract?.deposit_received || "",
          }}
          onSubmit={(values) => {
            axios
              .patch(
                CONFIG.API_URL + "/api/lease/edit/" + contract.id,
                {
                  stall: values.stall,
                  rental_amount: values.discount
                    ? rentAmount - values.discount
                    : rentAmount,
                  startdate: values.startdate,
                  enddate: values.enddate,
                  rental_frequency: values.frequency,
                  electric_meter: values.electric_meter,
                  water_meter: values.water_meter,
                  electric_initial_reading: values.electric_initial_reading,
                  water_initial_reading: values.water_initial_reading,
                  status: status,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              )
              .then((res) => {
                if (res.data.success) {
                  setSeverity("success");
                  setFinish(true);
                  setAlert(res.data.msg);
                  onClose();
                  return;
                }
              })
              .catch((error) => {
                if (error.response?.data?.success === false) {
                  setSeverity("error");
                  console.log(error);
                  return setAlert(error.response.data.msg);
                }
                setSeverity("error");
                console.log(error);
                return setAlert("Something went wrong");
              });
          }}
          type="tenants"
          lastbtn="Save"
        >
          <FormStep
            stepName="Lease"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={Yup.object({
              stall: Yup.array().min(1, "Please Select a Unit"),
              deposit: Yup.number(),
              deposit_received: Yup.number(),
              discount: Yup.number(),
              rent: Yup.number(),
              startdate: Yup.date().typeError("Please Provide Start Date"),
              enddate: Yup.date()
                .typeError("Please Provide End Date")
                .min(Yup.ref("startdate"), "End date must be after start date")
                .when("startdate", (st, schema) => {
                  if (st != null) {
                    st.setHours(st.getHours() + 1);
                    return schema.min(st, "End date must be after start date");

                    //this else prevents your page from crashing if there's any other input
                  } else return schema.min("1900-01-01");
                }),
              frequency: Yup.string(),
              electric_meter: Yup.string(),
              electric_initial_reading: Yup.string(),
              water_meter: Yup.number(),
              water_initial_reading: Yup.number(),
            })}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ pb: 3 }}>
                <Typography variant="h5">Lease Agreement</Typography>
                <Divider sx={{ pt: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <InputFields
                  disabled
                  type={"text"}
                  fullWidth
                  readOnly={true}
                  name="stall"
                  label="Stall Unit/s"
                  value={contract.stall}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker name="startdate" label="Start Date" />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker name="enddate" label="End Date" />
              </Grid>

              <Grid item xs={12}>
                <SelectField
                  name="frequency"
                  label="Rental Frequency"
                  data={[
                    { value: 1, label: "Monthly" },
                    { value: 2, label: "Daily" },
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="rent"
                  value={rentAmount}
                  disabled
                  label="Rent per day"
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">Monthly Billings:</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1">Electric Utility</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <InputFields
                  name="electric_meter"
                  label="Meter No."
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="electric_initial_reading"
                  label="Initial Reading"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1">Water Utility</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="water_meter"
                  label="Meter No."
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="water_initial_reading"
                  label="Initial Reading"
                  type="number"
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormStep>
        </MultiStepForm>
      ) : (
        setTimeout(() => {
          setFinish(false);
        }, 50)
      )}
    </div>
  );
};

export default EditTenants;
