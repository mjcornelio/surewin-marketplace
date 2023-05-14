import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const defaultValues = {
    email: "",
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
            data="/illustrations/undraw_mail_sent_re_0ofv.svg"
            width={100}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>
            Successfully Sent
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400 }}>
            Reset Password Link Successfully sent in your email account. Check
            your inbox or spam folder to view the link.
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
          const { email } = values;
          const loginUser = { email };
          axios
            .post(CONFIG.API_URL + "/api/auth/forgotPassword", loginUser)
            .then((res) => {
              if (res.data.success) {
                setSuccess(true);
                setPageLoading(false);
              }
            })
            .catch((error) => {
              if (error.response?.data?.success === false) {
                console.log(error);
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
              sx={{ px: "2" }}
              name="email"
              placeholder="Email Address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton edge="start" disabled>
                      <Iconify icon="eva:email-fill" />
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
                "Continue"
              )}
            </Button>
            <Tooltip title="Forgot password">
              <Link
                onClick={() => navigate("/login")}
                variant="subtitle2"
                underline="hover"
                style={{ cursor: "pointer", marginTop: "1rem" }}
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
