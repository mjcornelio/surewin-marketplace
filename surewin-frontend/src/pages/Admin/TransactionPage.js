import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Page from "../../components/Page";

import ParkingCollectionList from "../../layouts/parking/ParkingCollectionList";

import RentTransactions from "src/layouts/transaction/RentTransactions";
import UtilityRecord from "../../layouts/transaction/UtilityRecord.js";
import { CONFIG } from "src/config/config";
import Loader from "./Loader";
const TabStyle = styled("div")(({ theme }) => ({
  "& .Mui-selected": {
    backgroundColor: "#FFFFFF !important",
    color: "#000000 !important",
  },
  "& .MuiTab-root": {
    marginRight: "10px",
    padding: "0 30px",
    borderRadius: "5px 5px 0 0 ",
    backgroundColor: "#E9DDDD",
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
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  // eslint-disable-next-line
  const [transactions, setTransactions] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [tenants, setTenants] = useState(null);
  const [units, setUnits] = useState(null);
  const [parkingCollections, setParkingCollections] = useState(null);
  const [users, setUsers] = useState(null);
  // eslint-disable-next-line
  const [pageLoading, setPageLoading] = useState(false);
  const [reRender, setReRender] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      const transactionUrl = CONFIG.API_URL + "/api/transactions/";
      const invoicesUrl = CONFIG.API_URL + "/api/invoices/";
      const tenantsUrl = CONFIG.API_URL + "/api/tenants/";
      const parkingUrl = CONFIG.API_URL + "/api/parking_collections/";
      const unitsUrl = CONFIG.API_URL + "/api/property-units";
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      return await axios
        .all([
          axios.get(transactionUrl, headers),
          axios.get(invoicesUrl, headers),
          axios.get(tenantsUrl, headers),
          axios.get(parkingUrl, headers),
          axios.get(unitsUrl, headers),
        ])
        .then(
          axios.spread((res1, res2, res3, res4, res5) => {
            if (res1.data.success) {
              setTransactions(res1.data.transactions);
              setInvoices(res2.data.invoices);
              setTenants(res3.data.tenants);
              setParkingCollections(res4.data.parkingCollections);
              setUsers(res4.data.users);
              setUnits(res5.data.units);
              setPageLoading(false);
              return;
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
  }, [reRender]);

  return (
    <Page title="Payments">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 3 }}>
          Payments
        </Typography>
        <Box>
          <TabStyle>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Records" {...a11yProps(0)} />
              <Tab label="Utilities" {...a11yProps(1)} />
              <Tab label="Parking Collection" {...a11yProps(2)} />
            </Tabs>
          </TabStyle>
        </Box>
        <Box
          sx={{ height: "10px", width: "100%", backgroundColor: "#77BCFD" }}
        />
        {pageLoading ? (
          <Loader />
        ) : (
          <Box
            style={{
              boxShadow:
                "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
              backgroundColor: "#FFFFFF",
              padding: "2rem .5rem ",
            }}
          >
            <TabPanel value={value} index={0}>
              {invoices && (
                <RentTransactions
                  units={units}
                  TENANTS={tenants}
                  invoices={invoices}
                  setReRender={setReRender}
                  reRender={reRender}
                />
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {invoices && (
                <UtilityRecord
                  units={units}
                  TENANTS={tenants}
                  invoices={invoices}
                  setReRender={setReRender}
                  reRender={reRender}
                />
              )}
            </TabPanel>

            <TabPanel value={value} index={2}>
              {parkingCollections && (
                <ParkingCollectionList
                  parkingCollections={parkingCollections}
                  users={users}
                />
              )}
            </TabPanel>
          </Box>
        )}
      </Container>
    </Page>
  );
}
