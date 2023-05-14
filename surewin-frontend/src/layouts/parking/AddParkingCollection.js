import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useValue } from "../../context/ContextProvider";
import {
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import * as Yup from "yup";
import Iconify from "../../components/Iconify";
import InputFields from "../../components/form/InputFields";
import SelectField from "../../components/form/SelectField";
import TextArea from "../../components/form/TextArea";
import DatePicker from "../../components/form/DatePicker";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import { CONFIG } from "src/config/config";

const validationSchema = Yup.object({
  received_from: Yup.string(),
  received_amount: Yup.number().required("Please provide Received Amount"),
  date: Yup.date().typeError("Invalid Date"),
  description: Yup.string(),
});

const AddInvoice = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line
  const [parking_collections, setParkingCollections] = useState([]);
  const [finish, setFinish] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const {
    state: { currentUser },
  } = useValue();

  useEffect(() => {
    const fetchData = async () => {
      return await axios
        .get(CONFIG.API_URL + "/api/parking_collections/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setUsers(res.data.users);
            setParkingCollections(res.data.parkingCollections);
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
            received_from: "",
            received_amount: "",
            description: "",
            date: new Date(),
          }}
          onSubmit={(values) => {
            const parkingCollection = {
              received_from: values.received_from,
              received_amount: values.received_amount,
              description: values.description,
              date: values.date,
            };
            axios
              .post(
                CONFIG.API_URL + "/api/parking_collections/add",
                parkingCollection,
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
            stepName="Parking Collection Info"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={validationSchema}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={currentUser.user_role === "admin" ? 11 : 12}>
                    <SelectField
                      name="received_from"
                      label="Received From"
                      data={users.length > 0 ? users : [{ label: "None" }]}
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  {currentUser.user_role === "admin" && (
                    <Grid item xs={1} sx={{ mt: 1 }}>
                      <Tooltip title={"Add Staff"}>
                        <Link to="/staff/add">
                          <IconButton
                            variant="outlined"
                            aria-label="add"
                            size="small"
                            sx={{
                              backgroundColor: "#003A6B",
                              "&:hover": {
                                backgroundColor: "#2065D1",
                              },
                            }}
                          >
                            <Iconify
                              icon="akar-icons:plus"
                              sx={{
                                fontWeight: "bold",
                                color: "#ffffff",
                                width: 20,
                                height: 20,
                              }}
                            />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="received_amount"
                  label="Amount*"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker name="date" label="Date" />
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

export default AddInvoice;
