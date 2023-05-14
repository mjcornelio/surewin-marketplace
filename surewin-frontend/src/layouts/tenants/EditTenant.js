import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { WebcamCapture } from "../../components/WebCam";

import {
  Grid,
  Typography,
  Divider,
  Box,
  Dialog,
  Avatar,
  Button,
  DialogTitle,
  IconButton,
} from "@mui/material";
import * as Yup from "yup";

import InputFields from "../../components/form/InputFields";
import MultiStepForm, { FormStep } from "./MultiStepForm";
import Iconify from "src/components/Iconify";
import { CONFIG } from "src/config/config";
import useResponsive from "src/hooks/useResponsive";

const phoneRegExp = /((\+63)|0)\d{10}/;
let emailAddresses = [];
const EditTenants = ({ tenant, onClose, setSeverity, setAlert }) => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  const [finish, setFinish] = useState(false);
  const [open, setOpen] = useState(false);
  const [openValidId, setOpenValidId] = useState(false);
  const [validId, setValidId] = useState(null);
  const [validIdName, setValidIdName] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const [imgUrl, setImgUrl] = useState(null);
  const [validIdUrl, setValidIdUrl] = useState(null);
  const [imgSrc, setImgSrc] = useState(
    tenant.image ? CONFIG.API_URL + "/tenants/" + tenant.image : ""
  );
  const [idSrc, setIdSrc] = useState(
    tenant.valid_id ? CONFIG.API_URL + "/tenants/" + tenant.valid_id : ""
  );

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(tenant.image || null);
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
      {!finish ? (
        <MultiStepForm
          initialValues={{
            firstname: tenant.firstname || "",
            lastname: tenant.lastname || "",
            email: tenant.email || "",
            street_address: tenant.street_address || "",
            province: tenant.province || "",
            city: tenant.city || "",
            barangay: tenant.barangay || "",
            mobile: tenant.contact_number || "",
            profile: "",
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
                      const updateTenant = {
                        id: tenant.id,
                        firstname: values.firstname,
                        lastname: values.lastname,
                        email: values.email,
                        street_address: values.street_address,
                        province: values.province,
                        city: values.city,
                        barangay: values.barangay,
                        mobile: values.mobile,
                        avatar: res1.data.url,
                        valid_id: res2.data.url,
                      };
                      axios
                        .patch(
                          CONFIG.API_URL + "/api/tenants/edit/" + tenant.id,
                          updateTenant,
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
                            setFile(null);
                            setFileName(null);
                            setSeverity("success");
                            setFinish(true);
                            setAlert(res.data.msg);
                            onClose();
                            return;
                          }
                        });
                    });
                  } else {
                    const updateTenant = {
                      id: tenant.id,
                      firstname: values.firstname,
                      lastname: values.lastname,
                      email: values.email,
                      street_address: values.street_address,
                      province: values.province,
                      city: values.city,
                      barangay: values.barangay,
                      mobile: values.mobile,
                      avatar: res1.data.url,
                    };
                    axios
                      .patch(
                        CONFIG.API_URL + "/api/tenants/edit/" + tenant.id,
                        updateTenant,
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
                          setFile(null);
                          setFileName(null);
                          setSeverity("success");
                          setFinish(true);
                          setAlert(res.data.msg);
                          onClose();
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
                    const updateTenant = {
                      id: tenant.id,
                      firstname: values.firstname,
                      lastname: values.lastname,
                      email: values.email,
                      street_address: values.street_address,
                      province: values.province,
                      city: values.city,
                      barangay: values.barangay,
                      mobile: values.mobile,
                      valid_id: res2.data.url,
                    };
                    axios
                      .patch(
                        CONFIG.API_URL + "/api/tenants/edit/" + tenant.id,
                        updateTenant,
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
                          setFile(null);
                          setFileName(null);
                          setSeverity("success");
                          setFinish(true);
                          setAlert(res.data.msg);
                          onClose();
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
                const updateTenant = {
                  id: tenant.id,
                  firstname: values.firstname,
                  lastname: values.lastname,
                  email: values.email,
                  street_address: values.street_address,
                  province: values.province,
                  city: values.city,
                  barangay: values.barangay,
                  mobile: values.mobile,
                };
                axios
                  .patch(
                    CONFIG.API_URL + "/api/tenants/edit/" + tenant.id,
                    updateTenant,
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
                      setFile(null);
                      setFileName(null);
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
                      return setAlert(error.response.data.msg);
                    }
                    setSeverity("error");
                    return setAlert("Something went wrong");
                  });
              }
            }
          }}
          type="tenants"
          lastbtn="Save  Changes"
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
                    fileNameExt="capture-tenant.jpeg"
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
