import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Typography,
  Divider,
  Box,
  Snackbar,
  Alert,
  Avatar,
  Dialog,
  Button,
  IconButton,
  DialogTitle,
} from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import SelectField from "src/components/form/SelectField";
import { WebcamCapture } from "../../components/WebCam";
import { CONFIG } from "src/config/config";
import useResponsive from "src/hooks/useResponsive";
import Iconify from "src/components/Iconify";

const phoneRegExp = /((\+63)|0)\d{10}/;
let emailAddresses = [];
const AddTenants = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [finish, setFinish] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const navigate = useNavigate();
  const onDropProfile = (acceptedFiles) => {
    setFile(acceptedFiles);
    setFileName(Date.now() + "-" + acceptedFiles[0].name);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const usersUrl = CONFIG.API_URL + "/api/users";
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const fetchData = async () => {
      return await axios
        .all([axios.get(usersUrl, headers)])
        .then(
          axios.spread((res1) => {
            emailAddresses = res1.data.users.map((user) => user.email);
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
      .email("Please provide valid email address")
      .notOneOf(emailAddresses, "Email Already Taken"),
    mobile: Yup.string().matches(phoneRegExp, "Mobile number is not valid"),
  });

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
            firstname: "",
            lastname: "",
            email: "",
            street_address: "",
            province: "",
            city: "",
            barangay: "",
            zip: "",
            mobile: "",
            profile: "",
            user_role: "Admin",
          }}
          onSubmit={(values) => {
            if (file != null) {
              const CLOUDINARY_URL =
                "https://api.cloudinary.com/v1_1/dldibhv6k/image/upload";
              const CLOUDINARY_UPLOAD_PRESET = "dd0mu4kh";
              const formData = new FormData();
              formData.append("file", file[0], fileName);
              formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
              axios
                .post(CLOUDINARY_URL, formData)
                .then((res) => {
                  const user = {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    street_address: values.street_address,
                    province: values.province,
                    city: values.city,
                    barangay: values.barangay,
                    zip: values.zip,
                    mobile: values.mobile,
                    avatar: res.data.url,
                    user_role: values.user_role,
                  };

                  axios
                    .post(CONFIG.API_URL + "/api/users/add", user, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    })
                    .then((res) => {
                      if (res.data.success) {
                        setFile(null);
                        setFileName(null);
                        setSeverity("success");
                        setFinish(true);
                        setAlert(res.data.msg);
                        navigate("/staff", {
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
                  console.log(error);
                  return setAlert("Something went wrong");
                });
            } else {
              const user = {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                street_address: values.street_address,
                province: values.province,
                city: values.city,
                barangay: values.barangay,
                zip: values.zip,
                mobile: values.mobile,
                avatar: "",
                user_role: values.user_role,
              };

              axios
                .post(CONFIG.API_URL + "/api/users/add", user, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                })
                .then((res) => {
                  if (res.data.success) {
                    setFile(null);
                    setFileName(null);
                    setSeverity("success");
                    setFinish(true);
                    setAlert(res.data.msg);
                    navigate("/staff", {
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
                  console.log(error);
                  return setAlert("Something went wrong");
                });
            }
          }}
          type="tenants"
          lastbtn="Add Staff"
        >
          <FormStep
            stepName="Staffs Info"
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
                  <DialogTitle sx={{ position: "absolute", right: 8, top: 8 }}>
                    <IconButton
                      aria-label="close"
                      onClick={() => setOpen(false)}
                      sx={{
                        zIndex: "10",
                        color: (theme) => theme.palette.grey[500],
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
                    fileNameExt="capture-user.jpeg"
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
              <Grid item xs={12}>
                <SelectField
                  data={[
                    { label: "Admin" },
                    { label: "Manager" },
                    { label: "Parking Staff" },
                  ]}
                  name="user_role"
                  label="Role"
                />
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
