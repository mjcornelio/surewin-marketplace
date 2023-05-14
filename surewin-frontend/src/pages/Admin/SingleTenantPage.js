import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import { fCurrency, fShortenNumber } from "../../utils/formatNumber";

import {
  Container,
  Box,
  Typography,
  Grid,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  ListItemText,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Chip,
  Snackbar,
  Alert,
  Modal,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import Page from "../../components/Page";
import { Link, useParams, useNavigate } from "react-router-dom";

import { CONFIG } from "../../config/config";
import Iconify from "src/components/Iconify";
import TransactionList from "../../layouts/transaction/TransactionList";
import InvoiceList from "src/layouts/invoices/InvoiceList";
import EditTenants from "src/layouts/tenants/EditTenant";
import EditContract from "src/layouts/tenants/EditContract";
import { fDateNumber } from "src/utils/formatTime";
import useResponsive from "src/hooks/useResponsive";
import Loader from "./Loader";
import Contract from "../../layouts/tenants/Contract";

const TabStyle = styled("div")(({ theme }) => ({
  "& .Mui-selected": {
    backgroundColor: "#FFFFFF !important",
    color: "#000000 !important",
  },
  "& .MuiTab-root": {
    marginRight: "10px",
    borderRadius: "5px 5px 0 0 ",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        padding: "2rem 0",
      }}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

export default function Tenant() {
  const { id } = useParams();
  const [tenant, setTENANT] = useState(null);
  const [contract, setContract] = useState(null);
  const [transactions, setTransactions] = useState([0]);
  const [invoices, setInvoices] = useState([]);
  const [unit, setUnit] = useState(null);
  const [value, setValue] = React.useState(0);
  const [editTenant, setEditTenant] = useState(false);
  const [deleteTenant, setDeleteTenant] = useState(false);
  const [editContract, setEditContract] = useState(false);
  const [endContract, setEndContract] = useState(false);
  const [renewContract, setRenewContract] = useState(false);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const [openContract, setOpenContract] = useState(false);
  const navigate = useNavigate();
  const contractRef = React.createRef();
  const [permanentDeleteTenant, setPermanentDeleteTenant] = useState(false);
  const [recoverTenant, setRecoverTenant] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handlePrint = useReactToPrint({
    content: () => contractRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      const tenantUrl = CONFIG.API_URL + "/api/tenants/" + id;
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([axios.get(tenantUrl, headers)])
        .then(
          axios.spread((res1) => {
            if (res1.data.success) {
              const { tenant, contract, transactions, invoices, unit } =
                res1.data.data;
              setTENANT(tenant);
              setContract(contract);
              setInvoices(invoices);
              setTransactions(transactions);
              setPageLoading(false);
              return setUnit(unit);
            }
          })
        )
        .catch((error) => {
          if (error.response?.data?.success === false) {
          }
          console.log(error);
          return;
        });
    };

    fetchData();
  }, [editTenant, editContract, endContract, renewContract, id, deleteTenant]);
  return (
    <Page
      title={`${tenant ? `${tenant.firstname} ${tenant.lastname}` : "Tenant"}`}
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
      {/* //Edit Tenant */}
      <Dialog
        open={editTenant}
        onClose={() => setEditTenant(false)}
        maxWidth={"lg"}
        fullWidth
        fullScreen={isDesktop ? false : true}
      >
        <DialogTitle>
          Edit Tenant
          <IconButton
            aria-label="close"
            onClick={() => setEditTenant(false)}
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
          <EditTenants
            tenant={tenant}
            onClose={() => setEditTenant(false)}
            setSeverity={setSeverity}
            setAlert={setAlert}
          />
        </DialogContent>
      </Dialog>
      {/* //Archive Tenant */}
      <Modal
        open={deleteTenant}
        onClose={() => setDeleteTenant(false)}
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
              onClick={() => setDeleteTenant(false)}
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
            You are about to archive a tenant
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400, mx: "auto" }}>
            This will archive the tenant to avoid deletion of data.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              autoFocus
              variant="outlined"
              onClick={() => setDeleteTenant(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await axios
                    .delete(
                      CONFIG.API_URL + "/api/tenants/delete/" + tenant.id,

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
                        navigate("/tenants", {
                          state: {
                            alert: res.data.msg,
                            severity: "success",
                          },
                        });
                      }
                    });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* //Delete Tenant */}
      <Modal
        open={permanentDeleteTenant}
        onClose={() => setPermanentDeleteTenant(false)}
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
              onClick={() => setPermanentDeleteTenant(false)}
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
            data="/illustrations/undraw_notify_re_65on.svg"
            width={200}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            You are about to permanently Delete a Tenant!
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400, mx: "auto" }}>
            This will delete the tenant to the system database including
            contract, invoices and transactions. This cannot be undone!
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              autoFocus
              variant="outlined"
              onClick={() => setPermanentDeleteTenant(false)}
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
                        "/api/tenants/permanentdelete/" +
                        tenant.id,

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
                        navigate("/archive_contracts", {
                          state: {
                            alert: res.data.msg,
                            severity: "success",
                          },
                        });
                      }
                    });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* //Recover Tenant */}
      <Modal
        open={recoverTenant}
        onClose={() => setRecoverTenant(false)}
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
              onClick={() => setRecoverTenant(false)}
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
            data="/illustrations/undraw_completed_re_cisp.svg"
            width={200}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            You are about to Recover the Tenant
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400, mx: "auto" }}>
            This will will recover the tenant from archived storage.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              autoFocus
              variant="outlined"
              onClick={() => setRecoverTenant(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await axios
                    .patch(
                      CONFIG.API_URL + "/api/tenants/recover/" + tenant.id,

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
                        navigate("/tenants", {
                          state: {
                            alert: res.data.msg,
                            severity: "success",
                          },
                        });
                      }
                    });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* //Edit Contract */}
      <Dialog
        open={editContract}
        onClose={() => setEditContract(false)}
        maxWidth={"lg"}
        fullWidth
        fullScreen={isDesktop ? false : true}
      >
        <DialogTitle>
          Edit Lease
          <IconButton
            aria-label="close"
            onClick={() => setEditContract(false)}
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
          <EditContract
            contract={contract}
            units={unit}
            status="Edit"
            setSeverity={setSeverity}
            setAlert={setAlert}
            onClose={() => setEditContract(false)}
          />
        </DialogContent>
      </Dialog>
      {/* //Renew of Contract */}
      <Dialog
        open={renewContract}
        onClose={() => setRenewContract(false)}
        maxWidth={"lg"}
        fullWidth
      >
        <DialogTitle>
          Renew Lease
          <IconButton
            aria-label="close"
            onClick={() => setRenewContract(false)}
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
          <EditContract
            contract={contract}
            tenant={tenant}
            status="Renew"
            setSeverity={setSeverity}
            setAlert={setAlert}
            onClose={() => setRenewContract(false)}
          />
        </DialogContent>
      </Dialog>
      {/* //End of Contract */}
      <Modal
        open={endContract}
        onClose={() => setEndContract(false)}
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
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setEndContract(false)}
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
            data="/illustrations/undraw_terms_re_6ak4.svg"
            width={200}
            aria-label="illustration"
          />
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            End of Contract
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, maxWidth: 400, mx: "auto" }}>
            You are about to End the current Lease
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              autoFocus
              variant="outlined"
              onClick={() => setEndContract(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await axios
                    .patch(
                      CONFIG.API_URL + "/api/lease/end/" + contract.id,
                      { status: "Ended", unit: unit },
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
                        setEndContract(false);
                        setSeverity("success");
                        setAlert("Successfully End Lease");
                      }
                    });
                } catch (error) {
                  setSeverity("error");
                  setAlert("Something went wrong");
                }
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* COntract */}
      <Dialog
        open={openContract}
        onClose={() => setOpenContract(false)}
        maxWidth={"lg"}
        fullScreen={isDesktop ? false : true}
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenContract(false)}
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
          <Contract contract={contract} tenant={tenant} ref={contractRef} />
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Tooltip title="print">
              <Button variant="contained" sx={{ mt: 2 }} onClick={handlePrint}>
                Print Contract
              </Button>
            </Tooltip>
          </div>
        </DialogContent>
      </Dialog>

      <Container maxWidth="xl">
        <Box
          sx={{ height: "10px", width: "100%", backgroundColor: "#77BCFD" }}
        />
        <Box
          sx={{
            boxShadow:
              "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
            backgroundColor: "#FFFFFF",
            padding: "2rem",
            "@media (max-width: 500px)": {
              padding: "20px",
            },
            minHeight: "75vh",
          }}
        >
          {pageLoading ? (
            <Loader />
          ) : (
            tenant && (
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  md={4}
                  style={{ borderColor: "1px solid black", marginTop: "1rem" }}
                >
                  <Grid item xs={12}>
                    <Avatar
                      alt={tenant.name}
                      src={tenant.image && tenant.image}
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
                      {tenant.firstname + " " + tenant.lastname}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: "12px" }}>
                      Generate Summary Report
                    </Typography>
                    <Link to={`/reports`} style={{ textDecoration: "none" }}>
                      <Typography variant="h5">Tenant Transactions</Typography>
                    </Link>

                    <Link to={`/reports`} style={{ textDecoration: "none" }}>
                      <Typography variant="h5" sx={{ mt: 3 }}>
                        Tenant Rental Statement
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TabStyle>
                    <Tabs value={value} onChange={handleChange}>
                      <Tab label="General" {...a11yProps(0)} />
                      <Tab label="Invoices" {...a11yProps(1)} />
                      <Tab label="Transactions" {...a11yProps(2)} />
                    </Tabs>
                  </TabStyle>

                  <TabPanel value={value} index={0}>
                    <Typography
                      variant="h6"
                      color={"#6e6a6a"}
                      sx={{ fontWeight: "normal" }}
                    >
                      Contact Information
                      {tenant.account_status === "archived" ? (
                        <MoreMenu
                          menu={[
                            {
                              label: "Recover",
                              function: () => setRecoverTenant(true),
                            },
                            {
                              label: "Delete",
                              function: () => setPermanentDeleteTenant(true),
                            },
                          ]}
                        />
                      ) : (
                        <MoreMenu
                          menu={[
                            {
                              label: "Edit",
                              function: () => setEditTenant(true),
                            },
                            {
                              label: "Archive",
                              function: () => setDeleteTenant(true),
                            },
                          ]}
                        />
                      )}
                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: "#968c8c" }} />
                    <Grid container>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Mobile:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1" color={"#1283ff"}>
                          {tenant.contact_number ? tenant.contact_number : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Email Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography
                          variant="body1"
                          color={"#1283ff"}
                          sx={{ wordBreak: "break-all" }}
                        >
                          {tenant.email ? tenant.email : "--"}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Address:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="body1">{`${
                          tenant.street_address ? tenant.street_address : "--"
                        }, ${tenant.barangay ? tenant.barangay : "--"}, ${
                          tenant.city ? tenant.city : "--"
                        }, ${tenant.province ? tenant.province : "--"}, ${
                          tenant.zip ? tenant.zip : "--"
                        }`}</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Valid ID</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          p: 2,
                          "@media (max-width: 500px)": {
                            padding: "20px 0",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "320px",
                            margin: "auto",
                          }}
                        >
                          <Avatar
                            src={tenant.valid_id && tenant.valid_id}
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "0",
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, fontWeight: "normal" }}
                      color={"#6e6a6a"}
                    >
                      Lease Agreement
                      <MoreMenu
                        menu={[
                          {
                            label: "Edit Lease",
                            function: () => setEditContract(true),
                          },
                          {
                            label:
                              contract?.status === "Ended"
                                ? "Renew Lease"
                                : "End Lease",

                            function:
                              contract?.status === "Ended"
                                ? () => setRenewContract(true)
                                : () => setEndContract(true),
                          },
                        ]}
                      />
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: "#968c8c" }} />

                    {contract ? (
                      <Grid container>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">Status:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Chip
                            label={contract?.status}
                            color={
                              contract?.status === "Active"
                                ? "success"
                                : "error"
                            }
                            variant="filled"
                          />
                        </Grid>

                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Property Unit/s:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          {unit?.map((u) => (
                            <Typography variant="body1" key={u.id}>
                              {u.unit_title}
                            </Typography>
                          ))}
                        </Grid>

                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Start of Lease:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="body1">
                            {contract.start_date
                              ? fDateNumber(contract.start_date)
                              : "--"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            End of Lease:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="body1">
                            {contract.end_date
                              ? fDateNumber(contract.end_date)
                              : "--"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Rental Per Day:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="body1">
                            ₱
                            {contract.rental_amount
                              ? fCurrency(contract.rental_amount)
                              : "--"}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Rental Frequency:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ p: 2 }}>
                          <Typography variant="body1">
                            {contract.rental_frequency
                              ? contract.rental_frequency
                              : "--"}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Electric Utility
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ px: 2 }}>
                          <Typography variant="body1">Meter No.</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ px: 2 }}>
                          <Typography variant="body1">
                            {contract.electric_meter}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{ p: 2 }}>
                          <Typography variant="subtitle1">
                            Water Utility
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ px: 2 }}>
                          <Typography variant="body1">Meter No.</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ px: 2 }}>
                          <Typography variant="body1">
                            {contract.water_meter}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ pt: 5, textAlign: "center" }}>
                          <Tooltip title="View Contract">
                            <Button
                              variant="contained"
                              onClick={() => setOpenContract(true)}
                              sx={{ width: "100%", height: "60px" }}
                            >
                              View Contract
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container>
                        <Grid item xs={12} sx={{ py: 5, textAlign: "center" }}>
                          <Typography variant="h6">No Lease</Typography>
                        </Grid>
                      </Grid>
                    )}
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Outstanding Balance
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱
                          {fShortenNumber(
                            invoices
                              .map((i) => i.amount_to_paid - i.received)
                              .reduce((a, c) => {
                                return a + c;
                              }, 0)
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Paid
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱
                          {fShortenNumber(
                            invoices
                              .map((i) => i.received)
                              .reduce((a, c) => {
                                return a + c;
                              }, 0)
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Deposit
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱{fShortenNumber(contract ? contract.deposit : 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <InvoiceList invoices={invoices} tenant_id={id} />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Outstanding Balance
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱
                          {fCurrency(
                            invoices
                              .map((i) => i.amount_to_paid - i.received)
                              .reduce((a, c) => {
                                return a + c;
                              }, 0)
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Paid
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱
                          {fCurrency(
                            invoices
                              .map((i) => i.received)
                              .reduce((a, c) => {
                                return a + c;
                              }, 0)
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color={"#6e6a6a"}>
                          Deposit
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "2rem", fontWeight: "normal" }}
                        >
                          ₱{fCurrency(contract ? contract.deposit : 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TransactionList
                          transactions={transactions}
                          tenant_id={id}
                          contract={contract}
                          tenant={tenant}
                          unit={unit}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Grid>
              </Grid>
            )
          )}
        </Box>
      </Container>
    </Page>
  );
}
