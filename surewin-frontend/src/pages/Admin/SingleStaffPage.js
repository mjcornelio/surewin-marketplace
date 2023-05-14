import * as React from "react";
import { useNavigate } from "react-router-dom";
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
  Modal,
  Stack,
  Button,
  Box,
  Typography,
} from "@mui/material";

import Page from "../../components/Page";
import Iconify from "src/components/Iconify";
import EditUser from "../../layouts/users/EditUser";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useResponsive from "src/hooks/useResponsive";
import axios from "axios";
import { CONFIG } from "../../config/config";
import { UserMoreMenu } from "src/sections/@dashboard/user";
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
export default function SingleStaffPage() {
  const [fetchUser, setFetchUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const { id } = useParams();
  const isDesktop = useResponsive("up", "md");
  const [deletestaff, setDeleteStaff] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      return await axios
        .get(CONFIG.API_URL + "/api/users/" + id, {
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
    <Page
      title={
        fetchUser ? `${fetchUser.firstname} ${fetchUser.lastname}` : "Staff"
      }
    >
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
            wordBreak: "break-all",
          }}
        >
          {/* //Edit Staff */}
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
              />
            </DialogContent>
          </Dialog>
          {/* //Delete Staff */}
          <Modal
            open={deletestaff}
            onClose={() => setDeleteStaff(false)}
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
                minWidth: "400px",
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
              <DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={() => setDeleteStaff(false)}
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
              <object
                data="/illustrations/undraw_warning_re_eoyh.svg"
                width={200}
                aria-label="illustration"
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                You're going to remove a staff member.
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 5, maxWidth: 400, mx: "auto" }}
              >
                This will delete the staff from the system. This cannot be
                undone.
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  autoFocus
                  variant="outlined"
                  onClick={() => setDeleteStaff(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      await axios
                        .delete(
                          CONFIG.API_URL + "/api/users/delete/" + id,

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
                            navigate("/staff");
                          }
                        });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Modal>
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
                          {
                            label: "Delete",
                            function: () => setDeleteStaff(true),
                          },
                        ]}
                      />
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: "#968c8c" }} />
                    <Grid container>
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
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Role:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUser.user_role ? fetchUser.user_role : "--"}
                        </Typography>
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
