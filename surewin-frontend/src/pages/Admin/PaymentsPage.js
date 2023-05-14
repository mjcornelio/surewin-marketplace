import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

import Page from "../../components/Page";
import Transactions from "../../layouts/transaction/Transactions";
import UnpaidPayments from "../../layouts/transaction/UnpaidPayments";
import ParkingCollection from "../../layouts/transaction/ParkingCollection";

import { useValue } from "../../context/ContextProvider";
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
  "& .tab-panel": {
    backgroundColor: "#ffffff !important",
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
        boxShadow:
          "0px 3px 1px -2px rgb(145 158 171 / 20%), 0px 2px 2px 0px rgb(145 158 171 / 14%), 0px 1px 5px 0px rgb(145 158 171 / 12%)",
        backgroundColor: "#FFFFFF",
        borderRadius: "0 0 16px 16px",
        paddingBottom: "2rem",
        minHeight: "75vh",
      }}
    >
      {props?.title && (
        <Box
          style={{
            padding: "30px",
            backgroundColor: "#EFF0F6",
          }}
        >
          <Typography variant="h5">{props.title}</Typography>
          <Typography variant="body2">{props.subheader}</Typography>
        </Box>
      )}
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const {
    state: { currentUser },
  } = useValue();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Payments">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 3 }}>
          Payments
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabStyle>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Transactions" {...a11yProps(0)} />
                <Tab label="Unpaid Payments" {...a11yProps(1)} />
                {currentUser.role === "admin" && (
                  <Tab label="Parking Collection" {...a11yProps(2)} />
                )}
              </Tabs>
            </TabStyle>
          </Box>

          <TabPanel value={value} index={0}>
            <Transactions />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UnpaidPayments />
          </TabPanel>
          {currentUser.role === "admin" && (
            <TabPanel value={value} index={2}>
              <ParkingCollection />
            </TabPanel>
          )}
        </Box>
      </Container>
    </Page>
  );
}
