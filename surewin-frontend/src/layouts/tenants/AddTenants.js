import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

import {
  Grid,
  Typography,
  InputAdornment,
  Divider,
  Button,
  Snackbar,
  Alert,
  Avatar,
  TextField,
  Box,
  Modal,
  Stack,
  Dialog,
  DialogTitle,
  IconButton,
} from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import DatePicker from "../../components/form/DatePicker";
import SelectField from "../../components/form/SelectField";
import MultipleSelectField from "../../components/form/MultipleSelectField";
import CheckboxField from "../../components/form/CheckboxField";
import MultiStepForm, { FormStep } from "./MultiStepForm";
import useResponsive from "src/hooks/useResponsive";
import Iconify from "src/components/Iconify";
import { WebcamCapture } from "../../components/WebCam";
import { CONFIG } from "src/config/config";

const phoneRegExp = /((\+63)|0)\d{10}/;
let emailAddresses = [];
const AddTenants = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [units, setUnits] = useState([]);
  const [finish, setFinish] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [validId, setValidId] = useState(null);
  const [validIdName, setValidIdName] = useState(null);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [rentAmount, setRentAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [openValidId, setOpenValidId] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [idSrc, setIdSrc] = useState("");
  const [discount, setDiscount] = useState(0);
  const isDesktop = useResponsive("up", "md");
  const [electricMeter, setElectricMeter] = useState([]);
  const [waterMeter, setWaterMeter] = useState([]);
  const [data, setData] = useState(null);
  useEffect(() => {
    const tenantsUrl = CONFIG.API_URL + "/api/tenants",
      unitsUrl = CONFIG.API_URL + "/api/property-units";
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };
    const fetchData = async () => {
      return await axios
        .all([axios.get(tenantsUrl, headers), axios.get(unitsUrl, headers)])
        .then(
          axios.spread((res1, res2) => {
            emailAddresses = res1.data.tenants.map((tenant) => tenant.email);
            setUnits(
              res2.data.units.filter((unit) => unit.status === "vacant")
            );
          })
        )
        .catch((error) => console.log(error));
    };
    fetchData();
  }, [finish]);

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Please provide a first name"),
    lastname: Yup.string().required("Please provide a last name"),
    email: Yup.string()
      .required("Please provide a email address")
      .email("Please provide valid email address")
      .notOneOf(emailAddresses, "Email Already Taken"),
    mobile: Yup.string()
      .required("Please provide a mobile number")
      .matches(phoneRegExp, "Mobile number is not valid"),
    street_address: Yup.string().required(
      "Please provide valid street address"
    ),
    province: Yup.string().required("Please provide province"),
    city: Yup.string().required("Please provide city"),
    barangay: Yup.string().required("Please provide Barangay"),
  });
  const onDrop = (acceptedFiles) => {
    setValidId(acceptedFiles);
    setValidIdName(Date.now() + "-" + acceptedFiles[0].name);
    setIdSrc(null);
  };
  const onDropProfile = (acceptedFiles) => {
    setFile(acceptedFiles);
    setFileName(Date.now() + "-" + acceptedFiles[0].name);
    setImgSrc(null);
  };
  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Modal
        open={units.length < 1}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 6,
            borderRadius: "8px",
            minWidth: "500px",
            "@media (max-width: 600px)": {
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0",
            },
            margin: "auto",
            textAlign: "center",
          }}
        >
          <object
            data="/illustrations/undraw_house_searching_re_stk8.svg"
            width={200}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
            Oops!
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400 }}>
            Looks like all units are still occupied. You cannot create new
            tenancy, Add unit first
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate("/tenants")}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/property-units/add")}
            >
              Add Unit
            </Button>
          </Stack>
        </Box>
      </Modal>
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
            firstname: "",
            lastname: "",
            email: "",
            street_address: "",
            province: "",
            city: "",
            barangay: "",
            mobile: "",
            deposit: "",
            deposit_received: "",
            stall: [],
            frequency: "Daily",
            electric_meter: "",
            electric_initial_reading: "",
            water_meter: "",
            water_initial_reading: "",
            profile: "",
            discount: "",
          }}
          onSubmit={(values) => {
            const CLOUDINARY_URL =
              "https://api.cloudinary.com/v1_1/dldibhv6k/image/upload";
            const CLOUDINARY_UPLOAD_PRESET = "dd0mu4kh";
            if (file != null) {
              const formData = new FormData();
              formData.append("file", file[0], fileName);
              formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
              axios
                .post(CLOUDINARY_URL, formData)
                .then((res1) => {
                  if (validId !== null) {
                    const validIdData = new FormData();
                    validIdData.append("file", validId[0], validIdName);
                    validIdData.append(
                      "upload_preset",
                      CLOUDINARY_UPLOAD_PRESET
                    );
                    axios.post(CLOUDINARY_URL, validIdData).then((res2) => {
                      const tenant = {
                        firstname: values.firstname,
                        lastname: values.lastname,
                        email: values.email,
                        street_address: values.street_address,
                        province: values.province,
                        city: values.city,
                        barangay: values.barangay,
                        mobile: values.mobile,
                        deposit: values.deposit,
                        stall: values.stall,
                        rent: rentAmount - discount,
                        frequency: values.frequency,
                        electric: values.electric,
                        water: values.water,
                        internet: values.internet,
                        startdate: values.startdate,
                        enddate: values.enddate,
                        avatar: res1.data.url,
                        validId: res2.data.url,
                        unit_status: "occupied",
                        unit_id: values.stall,
                        deposit_received: values.deposit_received,
                        electric_meter: values.electric_meter,
                        electric_initial_reading:
                          values.electric_initial_reading,
                        water_meter: values.water_meter,
                        water_initial_reading: values.water_initial_reading,
                      };
                      axios
                        .post(CONFIG.API_URL + "/api/tenants/add", tenant, {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "accessToken"
                            )}`,
                          },
                        })
                        .then((res) => {
                          if (res.data.success) {
                            setFile(null);
                            setValidId(null);
                            setFileName(null);
                            setValidId(null);
                            setFinish(true);
                            setData(null);
                            navigate("/tenants", {
                              state: {
                                alert: res.data.msg,
                                severity: "success",
                              },
                            });
                            return;
                          }
                        });
                    });
                  } else {
                    const tenant = {
                      firstname: values.firstname,
                      lastname: values.lastname,
                      email: values.email,
                      street_address: values.street_address,
                      province: values.province,
                      city: values.city,
                      barangay: values.barangay,
                      mobile: values.mobile,
                      deposit: values.deposit,
                      stall: values.stall,
                      rent: rentAmount - discount,
                      frequency: values.frequency,
                      electric: values.electric,
                      water: values.water,
                      internet: values.internet,
                      startdate: values.startdate,
                      enddate: values.enddate,
                      avatar: res1.data.url,
                      validId: "",
                      unit_status: "occupied",
                      unit_id: values.stall,
                      deposit_received: values.deposit_received,
                      electric_meter: values.electric_meter,
                      electric_initial_reading: values.electric_initial_reading,
                      water_meter: values.water_meter,
                      water_initial_reading: values.water_initial_reading,
                    };
                    axios
                      .post(CONFIG.API_URL + "/api/tenants/add", tenant, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      })
                      .then((res) => {
                        if (res.data.success) {
                          setFile(null);
                          setValidId(null);
                          setFileName(null);
                          setValidId(null);
                          setFinish(true);
                          setData(null);
                          navigate("/tenants", {
                            state: {
                              alert: res.data.msg,
                              severity: "success",
                            },
                          });
                          return;
                        }
                      });
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
            } else {
              if (validId !== null) {
                const validIdData = new FormData();
                validIdData.append("file", validId[0], validIdName);
                validIdData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                axios
                  .post(CLOUDINARY_URL, validIdData)
                  .then((res2) => {
                    const tenant = {
                      firstname: values.firstname,
                      lastname: values.lastname,
                      email: values.email,
                      street_address: values.street_address,
                      province: values.province,
                      city: values.city,
                      barangay: values.barangay,
                      mobile: values.mobile,
                      deposit: values.deposit,
                      stall: values.stall,
                      rent: rentAmount - discount,
                      frequency: values.frequency,
                      electric: values.electric,
                      water: values.water,
                      internet: values.internet,
                      startdate: values.startdate,
                      enddate: values.enddate,
                      avatar: "",
                      validId: res2.data.url,
                      unit_status: "occupied",
                      unit_id: values.stall,
                      deposit_received: values.deposit_received,
                      electric_meter: values.electric_meter,
                      electric_initial_reading: values.electric_initial_reading,
                      water_meter: values.water_meter,
                      water_initial_reading: values.water_initial_reading,
                    };
                    axios
                      .post(CONFIG.API_URL + "/api/tenants/add", tenant, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      })
                      .then((res) => {
                        if (res.data.success) {
                          setFile(null);
                          setValidId(null);
                          setFileName(null);
                          setValidId(null);
                          setFinish(true);
                          setData(null);
                          navigate("/tenants", {
                            state: {
                              alert: res.data.msg,
                              severity: "success",
                            },
                          });
                          return;
                        }
                      });
                  })
                  .catch((error) => {
                    if (error.response?.data?.success === false) {
                      setSeverity("error");
                      return setAlert(error.response.data.msg);
                    }
                    setSeverity("error");
                    return setAlert("Something went wrong");
                  });
              } else {
                const tenant = {
                  firstname: values.firstname,
                  lastname: values.lastname,
                  email: values.email,
                  street_address: values.street_address,
                  province: values.province,
                  city: values.city,
                  barangay: values.barangay,
                  mobile: values.mobile,
                  deposit: values.deposit,
                  stall: values.stall,
                  rent: rentAmount - discount,
                  frequency: values.frequency,
                  electric: values.electric,
                  water: values.water,
                  internet: values.internet,
                  startdate: values.startdate,
                  enddate: values.enddate,
                  avatar: "",
                  validId: "",
                  unit_status: "occupied",
                  unit_id: values.stall,
                  deposit_received: values.deposit_received,
                  electric_meter: values.electric_meter,
                  electric_initial_reading: values.electric_initial_reading,
                  water_meter: values.water_meter,
                  water_initial_reading: values.water_initial_reading,
                };
                axios
                  .post(CONFIG.API_URL + "/api/tenants/add", tenant, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                    },
                  })
                  .then((res) => {
                    if (res.data.success) {
                      setFile(null);
                      setValidId(null);
                      setFileName(null);
                      setValidId(null);
                      setFinish(true);
                      setData(null);
                      navigate("/tenants", {
                        state: {
                          alert: res.data.msg,
                          severity: "success",
                        },
                      });
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
              }
            }
          }}
          type="tenants"
          lastbtn="Add Tenant"
        >
          <FormStep
            stepName="Tenants Info"
            icon="fluent:person-info-16-filled"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={validationSchema}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ pb: 3 }}>
                <Typography variant="h5">General Information</Typography>
                <Divider sx={{ pt: 2 }} />
              </Grid>
              <Grid item xs={12} sx={{ mb: 2, textAlign: "center" }}>
                <Dropzone onDrop={onDropProfile} acceptFiles={"img/jpg"}>
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      sx={{
                        width: "40%",
                        height: "220px",
                        margin: "auto",
                        border: "2px dashed rgba(0, 0, 0, 0.23)",
                        color: "#637381",
                        borderRadius: "10px",
                        cursor: "pointer",
                        "&:hover": {
                          border: "2px dashed black",
                          color: "black",
                        },
                        "@media (max-width: 508px)": {
                          width: "100%",
                        },
                      }}
                    >
                      <input {...getInputProps()} />
                      {file ? (
                        <Avatar
                          src={imgSrc ? imgSrc : URL.createObjectURL(file[0])}
                          sx={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "0",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            position: "relative",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: "100%",
                              height: "200px",
                              borderRadius: "0",
                            }}
                          ></Avatar>
                          <Typography
                            sx={{ position: "absolute", bottom: "10px" }}
                          >
                            Upload Image
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Dropzone>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  maxWidth={"xs"}
                  fullWidth
                  fullScreen={isDesktop ? false : true}
                >
                  <DialogTitle sx={{ position: "absolute", right: 8, top: 3 }}>
                    <IconButton
                      aria-label="close"
                      onClick={() => setOpen(false)}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                        zIndex: 10,
                      }}
                    >
                      <Iconify icon="ep:close-bold" />
                    </IconButton>
                  </DialogTitle>
                  <WebcamCapture
                    setFile={setFile}
                    setFileName={setFileName}
                    setImgSrc={setImgSrc}
                    setOpen={setOpen}
                    fileNameExt="capture-tenants.jpeg"
                  />
                </Dialog>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Open Camera
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <InputFields
                  name="firstname"
                  label="First Name*"
                  placeholder="e.g. Juan"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <InputFields
                  name="lastname"
                  label="Last Name*"
                  placeholder="e.g. Dela Cruz"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="email"
                  type={"email"}
                  label="Email Address"
                  placeholder="e.g. juandelacruz@gmail.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="mobile"
                  label="Mobile Number"
                  placeholder="e.g. 09123456789"
                />
              </Grid>
              <Grid item xs={12} sx={{ mb: 2, textAlign: "center" }}>
                <Dropzone onDrop={onDrop} acceptFiles={"img/jpg"}>
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      sx={{
                        width: "100%",
                        height: "320px",
                        border: "2px dashed rgba(0, 0, 0, 0.23)",
                        color: "#637381",
                        borderRadius: "10px",
                        cursor: "pointer",
                        "&:hover": {
                          border: "2px dashed black",
                          color: "black",
                        },
                      }}
                    >
                      <input {...getInputProps()} />
                      {validId ? (
                        <Avatar
                          src={idSrc ? idSrc : URL.createObjectURL(validId[0])}
                          sx={{
                            width: "100%",
                            height: "100%",

                            borderRadius: "0",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Iconify
                            icon={"bi:upload"}
                            sx={{ mb: 2, fontSize: "2rem" }}
                          />
                          <Typography>Upload Valid Id</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Dropzone>
                <Dialog
                  open={openValidId}
                  onClose={() => setOpenValidId(false)}
                  maxWidth={"xs"}
                  fullWidth
                  fullScreen={isDesktop ? false : true}
                >
                  <DialogTitle sx={{ position: "absolute", right: 8, top: 3 }}>
                    <IconButton
                      aria-label="close"
                      onClick={() => setOpenValidId(false)}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                        zIndex: 10,
                      }}
                    >
                      <Iconify icon="ep:close-bold" />
                    </IconButton>
                  </DialogTitle>
                  <WebcamCapture
                    setFile={setValidId}
                    setFileName={setValidIdName}
                    setImgSrc={setIdSrc}
                    setOpen={setOpenValidId}
                    fileNameExt="capture-validId.jpeg"
                  />
                </Dialog>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenValidId(true);
                  }}
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Open Camera
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ pb: 2 }}>
                <Typography variant="h6">Address</Typography>
              </Grid>
              <Grid item xs={12}>
                <InputFields
                  name="street_address"
                  label="Street Address"
                  placeholder="e.g. Street No./Subdivision"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <InputFields
                  name="barangay"
                  label="Barangay"
                  placeholder="e.g. Poblacion"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  name="city"
                  label="City"
                  placeholder="e.g. San Jose Del Monte"
                />
              </Grid>
              <Grid item xs={12}>
                <InputFields
                  name="province"
                  label="Provice/Region"
                  placeholder="e.g. Bulacan"
                />
              </Grid>
            </Grid>
          </FormStep>

          <FormStep
            stepName="Lease"
            onSubmit={(values) => setInputValues(values)}
            validationSchema={Yup.object({
              stall: Yup.array().min(1, "Please Select a Unit"),
              deposit: Yup.number(),
              deposit_received: Yup.number(),
              discount: Yup.number(),
              rent: Yup.number(),
              startdate: Yup.date()
                .required("Please provide Start Date")
                .typeError("Please Provide Start Date"),
              enddate: Yup.date()
                .required("Please provide End Date")
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
              electric_meter: Yup.string().required("Please provide meter no."),
              electric_initial_reading: Yup.string().required(
                "Please provide initial reading"
              ),
              water_meter: Yup.number().required("Please provide meter no."),
              water_initial_reading: Yup.number().required(
                "Please provide initial reading"
              ),
            })}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ pb: 3 }}>
                <Typography variant="h5">Lease Agreement</Typography>
                <Divider sx={{ pt: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <MultipleSelectField
                  name="stall"
                  label="Stall Unit/s"
                  data={units.length > 0 ? units : [{ label: "None" }]}
                  fullWidth
                  setData={setData}
                  setRent={setRentAmount}
                  rentHolder={
                    data?.length > 0
                      ? units
                          ?.filter((u) => data.some((d) => d === u.unit_title))
                          ?.map((a) => a.rental_amount)
                          ?.reduce((total, amount) => total + amount)
                      : 0
                  }
                  electric={
                    data?.length > 0
                      ? units
                          ?.filter((u) => data.some((d) => d === u.unit_title))
                          ?.map((a) => a.electric_meter)
                      : ""
                  }
                  setElectricMeter={setElectricMeter}
                  water={
                    data?.length > 0
                      ? units
                          ?.filter((u) => data.some((d) => d === u.unit_title))
                          ?.map((a) => a.water_meter)
                      : ""
                  }
                  setWaterMeter={setWaterMeter}
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

              <Grid item xs={12} md={6}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  value={rentAmount}
                  readOnly={true}
                  label="Rent per day"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="discount"
                  label="Discount"
                  type="number"
                  fullWidth
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="expectedAmount"
                  label="Expected Rate Per Day"
                  type="number"
                  fullWidth
                  value={rentAmount - discount}
                />
              </Grid>
              <Grid item xs={12}>
                <CheckboxField
                  label="Require Deposit"
                  name="deposit"
                  onChange={() => setRequireDeposit(!requireDeposit)}
                />
              </Grid>

              {requireDeposit && (
                <>
                  <Grid item xs={12} md={6}>
                    <InputFields
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      name="deposit"
                      label="Deposit"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputFields
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₱</InputAdornment>
                        ),
                      }}
                      name="deposit_received"
                      label="Amount Received"
                      type="number"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="body1">Monthly Billings:</Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1">Electric Utility</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <SelectField
                  name="electric_meter"
                  label="Meter No."
                  data={
                    electricMeter.length > 0
                      ? electricMeter
                      : [{ value: 1, label: "None" }]
                  }
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
                <SelectField
                  name="water_meter"
                  label="Meter No."
                  data={
                    waterMeter.length > 0
                      ? waterMeter
                      : [{ value: 1, label: "None" }]
                  }
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

export default AddTenants;
