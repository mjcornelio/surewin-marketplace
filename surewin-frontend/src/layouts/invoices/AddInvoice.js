import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Grid, Snackbar, Alert, InputAdornment } from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import SelectField from "../../components/form/SelectField";
import TextArea from "../../components/form/TextArea";
import DatePicker from "../../components/form/DatePicker";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import { CONFIG } from "src/config/config";

const validationSchema = Yup.object({
  payment_for: Yup.string().required("Please provide a Payment For"),
  payee: Yup.string().required("Please provide a Payers Name"),
  amount_to_paid: Yup.number().required("Please provide Amount to be Paid"),
  due_date: Yup.date().typeError("Invalid Date"),
  description: Yup.string(),
  received: Yup.number(),
});

const AddInvoice = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [tenants, setTenants] = useState([]);
  const [finish, setFinish] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const tenantId = searchParams.get("tenant");

  useEffect(() => {
    const fetchData = async () => {
      return await axios
        .get(CONFIG.API_URL + "/api/tenants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setTenants(res.data.tenants);
            return;
          }
        })
        .catch((error) => {
          if (error.response?.data?.success === false) {
            setSeverity("error");
            return setAlert(error.response.data.msg);
          }
          setSeverity("error");
          return setAlert("Something went wrong");
        });
    };
    fetchData();
  }, [finish]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Snackbar
        open={Boolean(alert)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={() => {
          setAlert(null);
        }}
      >
        <Alert
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => {
            setAlert(null);
          }}
        >
          {alert}
        </Alert>
      </Snackbar>
      {!finish ? (
        <MultiStepForm
          initialValues={{
            payment_for: "",
            payee: tenantId || "",
            amount_to_paid: "",
            description: "",
            due_date: "",
            received: "",
          }}
          onSubmit={(values) => {
            const invoice = {
              tenant_id: values.payee,
              status: "Unpaid",
              payment_for: values.payment_for,
              amount_to_paid: values.amount_to_paid,
              due_date: values.due_date ? values.due_date : Date.now(),
              description: values.description,
              received: values.received,
            };

            axios
              .post(CONFIG.API_URL + "/api/invoices/add", invoice, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              })
              .then((res) => {
                if (res.data.success) {
                  setSeverity("success");
                  setFinish(true);
                  return setAlert(res.data.msg);
                }
              })
              .catch((error) => {
                if (error.response?.data?.success === false) {
                  setSeverity("error");
                  return setAlert(error.response.data.msg);
                }
                setSeverity("error");
                return setAlert("Something went wrong");
              });
          }}
          type="transaction"
          lastbtn="Submit"
        >
          <FormStep
            stepName="Invoice Info"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={validationSchema}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputFields name="payment_for" label="Payment For" />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  name="payee"
                  label="Payers Name"
                  setSelected={tenantId}
                  data={tenants.length > 0 ? tenants : [{ label: "None" }]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="amount_to_paid"
                  label="Amount To Be Paid*"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  name="monthOf"
                  label="For Month and Year"
                  openTo={"month"}
                  views={["month", "year"]}
                />
              </Grid>
              {/* <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Already Paid?"
                    sx={{ color: "#828282", fontStyle: "italic" }}
                  />
                </FormGroup>
              </Grid>
              {checked && (
                <>
                  <Grid item xs={12}>
                    <SelectField
                      name="method"
                      label="Payment Method"
                      data={[{ label: "Cash" }, { label: "E-Payment" }]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputFields
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      name="received"
                      label="Received"
                      type="number"
                    />
                  </Grid>
                </>
              )} */}

              <Grid item xs={12}>
                <TextArea
                  name="description"
                  type="textArea"
                  label="Desciption"
                  placeholder="Write something about this transaction..."
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

export default AddInvoice;
