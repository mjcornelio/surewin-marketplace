import * as Yup from "yup";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// form
import { Form, Formik } from "formik";
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Button,
  Alert,
  Fade,
  Box,
  Tooltip,
  Link,
  Modal,
  Typography,
} from "@mui/material";

// components
import Iconify from "../../../components/Iconify";

import InputFields from "src/components/form/InputFields";
import { CircularProgress } from "@mui/material";
import { CONFIG } from "src/config/config";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id } = useParams("id");
  const { token } = useParams("token");

  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .required("This Field is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),

    confirmpassword: Yup.string()
      .required("This Field is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    password: "",
    confirmpassword: "",
  };

  return (
    <>
      <Modal
        open={success}
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
            data="/illustrations/undraw_completed_re_cisp.svg"
            width={200}
            aria-label="Illustrations"
          />
          <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
            Successfully Reset Password
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400 }}>
            Your password has been reset, you can now use your new password to
            login to your account.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Formik
        initialValues={defaultValues}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          setPageLoading(true);

          const { password } = values;
          const loginUser = { password: password, id: id, token: token };
          axios
            .post(CONFIG.API_URL + "/api/auth/resetPassword", loginUser)
            .then((res) => {
              if (res.data.success) {
                setSuccess(true);
                setPageLoading(false);
              }
            })
            .catch((error) => {
              if (error.response?.data?.success === false) {
                setAlert(error.response.data.msg);
                setPageLoading(false);
                setTimeout(() => {
                  setAlert(null);
                }, 5000);
                return;
              }
              setPageLoading(false);
              console.log(error);
              setAlert("Something went wrong — Please Try Again");
              setTimeout(() => {
                setAlert(null);
              }, 5000);
              return;
            });
        }}
      >
        <Form>
          {alert && (
            <Fade in={Boolean(alert)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "0",
                  px: 5,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Alert severity="error" sx={{ borderRadius: "0" }}>
                  {alert}
                </Alert>
              </Box>
            </Fade>
          )}
          <Stack spacing={3}>
            <InputFields
              name="password"
              placeholder="Password"
              autoComplete="on"
              type={showPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton edge="start" disabled>
                      <Iconify icon="eva:lock-fill" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <InputFields
              name="confirmpassword"
              placeholder="Confirm Password"
              autoComplete="on"
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton edge="start" disabled>
                      <Iconify icon="eva:lock-fill" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showConfirmPassword
                            ? "eva:eye-fill"
                            : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <Button fullWidth size="large" type="submit" variant="contained">
              {pageLoading === true ? (
                <CircularProgress sx={{ color: "White", padding: "5px" }} />
              ) : (
                "Submit"
              )}
            </Button>
            <Tooltip title="Forgot password">
              <Link
                onClick={() => navigate("/login")}
                variant="subtitle2"
                underline="hover"
                style={{ cursor: "pointer", margin: "1rem 0 " }}
              >
                Back To Login
              </Link>
            </Tooltip>
          </Stack>
        </Form>
      </Formik>
    </>
  );
}
