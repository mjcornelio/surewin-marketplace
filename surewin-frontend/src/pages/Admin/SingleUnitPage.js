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
  Chip,
  Box,
  Typography,
} from "@mui/material";

import Page from "../../components/Page";
import Iconify from "src/components/Iconify";
import EditUnit from "../../layouts/units/EditUnit";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useResponsive from "src/hooks/useResponsive";
import axios from "axios";
import { CONFIG } from "../../config/config";
import { fCurrency } from "src/utils/formatNumber";
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
  const [fetchUnit, setFetchUnit] = useState(null);
  const [editUnit, setEditUnit] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const { id } = useParams();
  const isDesktop = useResponsive("up", "md");
  const [deleteUnit, setDeleteUnit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      return await axios
        .get(CONFIG.API_URL + "/api/property-units/" + id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setFetchUnit(res.data.units);
            setPageLoading(false);
          }
        })
        .catch((error) => {
          if (error.response?.data?.success === false) {
            navigate("/propety-units");
          }
          console.log(error);
          return;
        });
    };
    fetchData();
  }, [editUnit]);
  return (
    <Page title={fetchUnit ? `${fetchUnit.unit_title}` : "Property Unit"}>
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
          {/* //Edit Unit */}
          <Dialog
            open={editUnit}
            onClose={() => setEditUnit(false)}
            maxWidth={"lg"}
            fullWidth
            fullScreen={isDesktop ? false : true}
          >
            <DialogTitle>
              Edit Unit
              <IconButton
                aria-label="close"
                onClick={() => setEditUnit(false)}
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
              <EditUnit
                unit={fetchUnit}
                onClose={() => setEditUnit(false)}
                setSeverity={setSeverity}
                setAlert={setAlert}
              />
            </DialogContent>
          </Dialog>
          {/* //Delete Staff */}
          <Modal
            open={deleteUnit}
            onClose={() => setDeleteUnit(false)}
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
                  onClick={() => setDeleteUnit(false)}
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
              {fetchUnit?.status !== "occupied" ? (
                <>
                  <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                    You're going to remove a property unit.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 5, maxWidth: 400, mx: "auto" }}
                  >
                    This will delete the property unit from the system. This
                    cannot be undone. This will delete the property unit from
                    the system. This cannot be undone.
                  </Typography>

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      autoFocus
                      variant="outlined"
                      onClick={() => setDeleteUnit(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        try {
                          await axios
                            .delete(
                              CONFIG.API_URL +
                                "/api/property-units/delete/" +
                                id,

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
                                navigate("/property-units");
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
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                    You're cannot delete the unit.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 5, maxWidth: 400, mx: "auto" }}
                  >
                    Seems like this unit has an active occupant.
                  </Typography>

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      autoFocus
                      variant="outlined"
                      onClick={() => setDeleteUnit(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </>
              )}
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
              fetchUnit && (
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
                        src={fetchUnit.image ? fetchUnit.image : ""}
                        style={{
                          width: "100%",
                          height: "300px",
                          borderRadius: "0",
                          margin: "auto",
                        }}
                      >
                        <Typography sx={{ fontSize: "12rem" }}>
                          <Iconify
                            icon="healthicons:market-stall"
                            style={{ verticalAlign: "middle" }}
                          />
                        </Typography>
                      </Avatar>
                    </Grid>
                    <Grid item xs={12} sx={{ py: 2, textAlign: "center" }}>
                      <Typography variant="h3">
                        {fetchUnit.unit_title}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h6"
                      color={"#6e6a6a"}
                      sx={{ fontWeight: "normal", mt: 4 }}
                    >
                      General Information
                      <MoreMenu
                        menu={[
                          {
                            label: "Edit",
                            function: () => setEditUnit(true),
                          },
                          {
                            label: "Delete",
                            function: () => setDeleteUnit(true),
                          },
                        ]}
                      />
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: "#968c8c" }} />
                    <Grid container>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Property Type:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.type ? fetchUnit.type : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Unit No:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.id ? fetchUnit.id : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Status:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Chip
                          label={fetchUnit?.status}
                          color={
                            fetchUnit?.status === "vacant"
                              ? "success"
                              : fetchUnit.status === "occupied"
                              ? "primary"
                              : "error"
                          }
                          variant="filled"
                        />
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Rental Amount:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.rental_amount
                            ? `₱${fCurrency(fetchUnit.rental_amount)}`
                            : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Description:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.description ? fetchUnit.description : "--"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Electric Meter:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.electric_meter
                            ? fetchUnit.electric_meter
                            : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Water Meter:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">
                          {fetchUnit.water_meter ? fetchUnit.water_meter : "--"}
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
