import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  Typography,
  Divider,
  Dialog,
  Button,
  Box,
  Avatar,
  Snackbar,
  Alert,
  InputAdornment,
  DialogTitle,
  IconButton,
} from "@mui/material";
import * as Yup from "yup";
import { WebcamCapture } from "../../components/WebCam";
import InputFields from "../../components/form/InputFields";
import TextArea from "../../components/form/TextArea";
import MultiStepForm, { FormStep } from "../tenants/MultiStepForm";
import Iconify from "src/components/Iconify";
import { CONFIG } from "src/config/config";
import useResponsive from "src/hooks/useResponsive";

const validationSchema = Yup.object({
  type: Yup.string().required("Please provide a property type"),
  rent: Yup.number().required("Please provide rental amount per day"),
  description: Yup.string(),
});

const AddUnit = () => {
  // eslint-disable-next-line
  const [inputValues, setInputValues] = useState({});
  // eslint-disable-next-line
  const [finish, setFinish] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const isDesktop = useResponsive("up", "md");
  const navigate = useNavigate();
  const onDropProfile = (acceptedFiles) => {
    setFile(acceptedFiles);
    setFileName(Date.now() + "-" + acceptedFiles[0].name);
  };
  const [open, setOpen] = useState(false);

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
            type: "",
            image: "",
            rent: "",
            electric_meter: "",
            water_meter: "",
            description: "",
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
                  const unit = {
                    type: values.type,
                    rental_amount: values.rent,
                    image: res.data.url,
                    description: values.description,
                    electric_meter: values.electric_meter,
                    water_meter: values.water_meter,
                    status: "vacant",
                  };
                  axios
                    .post(CONFIG.API_URL + "/api/property-units/add", unit, {
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
                        navigate("/property-units", {
                          state: {
                            alert: res.data.msg,
                            severity: "success",
                          },
                        });
                        return setAlert(res.data.msg);
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
              const unit = {
                type: values.type,
                rental_amount: values.rent,
                description: values.description,
                image: "",
                electric_meter: values.electric_meter,
                water_meter: values.water_meter,

                status: "vacant",
              };
              axios
                .post(CONFIG.API_URL + "/api/property-units/add", unit, {
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
                    navigate("/property-units", {
                      state: {
                        alert: res.data.msg,
                        severity: "success",
                      },
                    });
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
            }
          }}
          type="units"
          lastbtn="Add Unit"
        >
          <FormStep
            stepName="Units Info"
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
                      {file ? (
                        <Avatar
                          src={imgSrc ? imgSrc : URL.createObjectURL(file[0])}
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
                          <Typography>Upload Unit Picture</Typography>
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
                    filenameExt="capture-unit.jpeg"
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
                <InputFields name="type" label="Property Type*" />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputFields
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₱</InputAdornment>
                    ),
                  }}
                  name="rent"
                  label="Rent per day*"
                  type="number"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="body1">Electric Utility</Typography>
                </Grid>

                <Grid item xs={12}>
                  <InputFields
                    name="electric_meter"
                    label="Meter No."
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="body1">Water Utility</Typography>
                </Grid>
                <Grid item xs={12}>
                  <InputFields
                    name="water_meter"
                    label="Meter No."
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextArea
                  name="description"
                  type="textArea"
                  label="Desciption"
                  placeholder="Write something about this unit..."
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

export default AddUnit;
