import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// form
import { Form, Formik } from "formik";
// @mui
import {
  Stack,
  Link,
  IconButton,
  InputAdornment,
  Button,
  Alert,
  Fade,
  Box,
  Tooltip,
} from "@mui/material";
import { useValue } from "../../../context/ContextProvider";

// components
import Iconify from "../../../components/Iconify";

import InputFields from "src/components/form/InputFields";
import CheckboxField from "src/components/form/CheckboxField";
import { CircularProgress } from "@mui/material";
import { CONFIG } from "src/config/config";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
    remember: false,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={LoginSchema}
      onSubmit={async (values) => {
        setPageLoading(true);
        const { email, password } = values;
        const loginUser = { email, password };
        axios
          .post(CONFIG.API_URL + "/api/auth/login", loginUser, {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            if (res.data.success) {
              localStorage.setItem("accessToken", res.data.accessToken);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              localStorage.setItem(
                "remember",
                values.remember ? "true" : "false"
              );
              dispatch({
                type: "UPDATE_USER",
                payload: JSON.parse(localStorage.getItem("user")),
              });
              navigate(currentUser.user_role === "admin" ? "/" : "/payments", {
                replace: true,
              });
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
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            my: 2,
            "@media (max-width:400px)": {
              flexDirection: "column",
            },
          }}
        >
          <CheckboxField name="remember" label="Remember me" />

          <Tooltip title="Forgot password">
            <Link
              onClick={() => navigate("/forgotpassword")}
              variant="subtitle2"
              underline="hover"
              style={{ cursor: "pointer" }}
            >
              Forgot password?
            </Link>
          </Tooltip>
        </Stack>

        <Button fullWidth size="large" type="submit" variant="contained">
          {pageLoading === true ? (
            <CircularProgress sx={{ color: "White", padding: "5px" }} />
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </Formik>
  );
}
