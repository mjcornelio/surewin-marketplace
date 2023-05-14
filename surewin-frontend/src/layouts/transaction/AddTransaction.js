import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Grid, Snackbar, Alert, InputAdornment } from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import SelectField from "../../components/form/SelectField";
import TextArea from "../../components/form/TextArea";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import { CONFIG } from "src/config/config";

const validationSchema = Yup.object({
  invoice: Yup.string().required("Please provide a Payment For"),
  payee: Yup.string().required("Please provide a Payers Name"),
  amount: Yup.number().required("Please provide Amount to Pay"),
  description: Yup.string(),
  payment_method: Yup.string(),
});

const AddTransaction = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [tenants, setTenants] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [finish, setFinish] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();
  const tenantId = searchParams.get("tenant");
  const invoiceId = searchParams.get("invoice");
  const [tenant, setTenant] = useState(null);
  const [initialInvoice, setInitialInvoice] = useState(
    invoiceId ? invoiceId : null
  );
  useEffect(() => {
    const fetchData = async () => {
      const tenantUrl = CONFIG.API_URL + "/api/tenants";
      const invoiceUrl = CONFIG.API_URL + "/api/invoices";
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([axios.get(tenantUrl, headers), axios.get(invoiceUrl, headers)])
        .then(
          axios.spread((res1, res2) => {
            if (res1.data.success && res2.data.success) {
              setTenants(res1.data.tenants);
              setInvoices(res2.data.invoices);
            }
          })
        )
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
            invoice: invoiceId || "",
            payee: tenantId || "",
            amount: "",
            description: "",
            payment_method: "",
          }}
          onSubmit={(values) => {
            const transaction = {
              id:
                tenantId.slice(0, 8) +
                "-" +
                new Date().getTime().toString().slice(8, 13),
              tenant_id: values.payee,
              invoice: values.invoice,
              amount: values.amount,
              description: values.description,
              payment_method: values.payment_method,
            };
            axios
              .post(CONFIG.API_URL + "/api/transactions/add", transaction, {
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
            stepName="Transaction Info"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={validationSchema}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <SelectField
                  name="payee"
                  label="Payers Name"
                  disabled={Boolean(tenantId)}
                  onClick={(e) => setTenant(e.target.dataset.value)}
                  setSelected={tenantId}
                  data={tenants?.length > 0 ? tenants : [{ label: "None" }]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  name="invoice"
                  onClick={(e) => setInitialInvoice(e.target.dataset.value)}
                  label="Select Invoice"
                  setSelected={invoiceId}
                  data={
                    tenantId
                      ? invoices?.length > 0
                        ? invoices.filter(
                            (invoice) =>
                              invoice.tenant_id === tenantId &&
                              invoice.status !== "Paid"
                          )
                        : [{ label: "None" }]
                      : invoices.filter(
                          (invoice) =>
                            invoice.tenant_id === tenant &&
                            invoice.status !== "Paid"
                        )
                  }
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
                  name="amount"
                  label="Amount*"
                  type="number"
                  placeholder={`${
                    initialInvoice
                      ? invoices?.find((i) => i.id === initialInvoice)
                          ?.amount_to_paid -
                        invoices?.find((i) => i.id === initialInvoice)?.received
                      : ""
                  }`}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  name="payment_method"
                  label="Payment Method"
                  data={[{ label: "Cash" }, { label: "Online" }]}
                  fullWidth
                />
              </Grid>

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

export default AddTransaction;
