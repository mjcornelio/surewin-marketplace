import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Container,
  Grid,
  Avatar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  DialogTitle,
  DialogContent,
  Dialog,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import useResponsive from "src/hooks/useResponsive";
import Page from "../../components/Page";
import Iconify from "src/components/Iconify";
import EditUser from "../../layouts/users/EditUser";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { CONFIG } from "../../config/config";
import InputFields from "src/components/form/InputFields";
function MoreMenu({ menu }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip title="More Options">
        <IconButton
          ref={ref}
          onClick={() => setIsOpen(true)}
          sx={{ float: "right", my: -1 }}
        >
          <Iconify icon="eva:more-horizontal-fill" width={30} height={30} />
        </IconButton>
      </Tooltip>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menu?.map((option) => (
          <MenuItem
            sx={{ color: "text.secondary" }}
            key={option.label}
            onClick={option.function}
          >
            <ListItemText
              primary={option.label}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
export default function Tenants() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [fetchUser, setFetchUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const [changePass, setChangePass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      return await axios
        .get(CONFIG.API_URL + "/api/users/" + user.id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setFetchUser(res.data.user);
            setPageLoading(false);
          }
        })
        .catch((error) => {
          if (error.response?.data?.success === false) {
          }
          console.log(error);
          return;
        });
    };
    fetchData();
  }, [editProfile]);

  return (
    <Page title="Profile">
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

      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 3 }}>
          Profile
        </Typography>
        <Box
          sx={{ height: "10px", width: "100%", backgroundColor: "#77BCFD" }}
        />
        <Box
          style={{
            boxShadow:
              "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
            backgroundColor: "#FFFFFF",
            padding: "2rem",
            minHeight: "500px",
          }}
        >
          {/* //Edit Tenant */}
          <Dialog
            open={editProfile}
            onClose={() => setEditProfile(false)}
            maxWidth={"lg"}
            fullWidth
            fullScreen={isDesktop ? false : true}
          >
            <DialogTitle>
              Edit Profile
              <IconButton
                aria-label="close"
                onClick={() => setEditProfile(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Iconify icon="ep:close-bold" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <EditUser
                user={fetchUser}
                onClose={() => setEditProfile(false)}
                setSeverity={setSeverity}
                setAlert={setAlert}
                settings="settings"
              />
            </DialogContent>
          </Dialog>
          {/* //Change Password */}
          <Dialog
            open={changePass}
            onClose={() => setChangePass(false)}
            maxWidth={"xs"}
            fullWidth
            fullScreen={isDesktop ? false : true}
          >
            <DialogTitle>
              Change Password
              <IconButton
                aria-label="close"
                onClick={() => setChangePass(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Iconify icon="ep:close-bold" />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                mt: isDesktop ? 2 : 15,
              }}
            >
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmpassword: "",
                }}
                validationSchema={Yup.object().shape({
                  currentPassword: Yup.string().required(
                    "This Field is required"
                  ),
                  newPassword: Yup.string()
                    .required("This Field is required")
                    .matches(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                    ),

                  confirmpassword: Yup.string()
                    .required("This Field is required")
                    .oneOf(
                      [Yup.ref("newPassword"), null],
                      "Passwords must match"
                    ),
                })}
                onSubmit={async (values) => {
                  setPageLoading(true);
                  try {
                    const { currentPassword, newPassword } = values;
                    const modifyPassword = {
                      currentPassword,
                      newPassword,
                    };
                    await axios
                      .patch(
                        CONFIG.API_URL + "/api/change-password/" + user.id,
                        modifyPassword,
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
                          setAlert(res.data.msg);
                          setPageLoading(false);
                          setSeverity("success");
                          return setChangePass(false);
                        }
                      })
                      .catch((error) => {
                        if (error.response?.data?.success === false) {
                          setAlert(error.response.data.msg);
                          setPageLoading(false);
                          setSeverity("error");
                          return;
                        }
                        setPageLoading(false);
                        setAlert("Something went wrong — Please Try Again");
                        setSeverity("error");
                        return;
                      });
                  } catch (error) {
                    setPageLoading(false);
                    setAlert("Something went wrong — Please Try Again");
                    setSeverity("error");
                    return;
                  }
                }}
              >
                <Form>
                  <Stack spacing={3}>
                    <InputFields
                      name="currentPassword"
                      placeholder="Current Password"
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
                                  showPassword
                                    ? "eva:eye-fill"
                                    : "eva:eye-off-fill"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <InputFields
                      name="newPassword"
                      placeholder="New Password"
                      autoComplete="on"
                      type={showNewPassword ? "text" : "password"}
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
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                            >
                              <Iconify
                                icon={
                                  showNewPassword
                                    ? "eva:eye-fill"
                                    : "eva:eye-off-fill"
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
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      {pageLoading === true ? (
                        <CircularProgress
                          sx={{ color: "White", padding: "5px" }}
                        />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </Stack>
                </Form>
              </Formik>
            </DialogContent>
          </Dialog>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {pageLoading ? (
              <Box
                style={{
                  width: "100%",
                  height: "90vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              fetchUser && (
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    style={{
                      borderColor: "1px solid black",
                      marginTop: "1rem",
                    }}
                  >
                    <Grid item xs={12}>
                      <Avatar
                        alt="Profile Picture"
                        src={fetchUser.image && fetchUser.image}
                        style={{
                          width: "100%",
                          height: "300px",
                          borderRadius: "0",
                          margin: "auto",
                        }}
                      ></Avatar>
                    </Grid>
                    <Grid item xs={12} sx={{ py: 2, textAlign: "center" }}>
                      <Typography variant="h3">
                        {fetchUser.firstname + " " + fetchUser.lastname}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h6"
                      color={"#6e6a6a"}
                      sx={{ fontWeight: "normal", mt: 4 }}
                    >
                      Contact Information
                      <MoreMenu
                        menu={[
                          {
                            label: "Edit",
                            function: () => setEditProfile(true),
                          },
                        ]}
                      />
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: "#968c8c" }} />
                    <Grid container sx={{ wordBreak: "break-all" }}>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Mobile:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1" color={"#1283ff"}>
                          {fetchUser.contact_number
                            ? fetchUser.contact_number
                            : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Email Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1" color={"#1283ff"}>
                          {fetchUser.email ? fetchUser.email : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Address:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">{`${
                          fetchUser.street_address
                            ? fetchUser.street_address
                            : "--"
                        }, ${fetchUser.barangay ? fetchUser.barangay : "--"}, ${
                          fetchUser.city ? fetchUser.city : "--"
                        }, ${fetchUser.province ? fetchUser.province : "--"}, ${
                          fetchUser.zip ? fetchUser.zip : "--"
                        }`}</Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          fullWidth={isDesktop ? false : true}
                          sx={{ mt: 4, p: 1 }}
                          onClick={() => setChangePass(true)}
                        >
                          Change Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
            )}
          </Box>
        </Box>
      </Container>
    </Page>
  );
}
