import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { fDateWord } from "src/utils/formatTime";
import Iconify from "src/components/Iconify";
import { CONFIG } from "src/config/config";

export default function UtilitiesSettings() {
  const [electric, setElectric] = useState(0);
  const [water, setWater] = useState(0);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [severity, setSeverity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      return await axios
        .get(CONFIG.API_URL + "/api/utility", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setElectric(res.data.utility[0].electricity_rate);
            setWater(res.data.utility[0].water_rate);
            setId(res.data.utility[0].id);
          }
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setEdit(!edit);
  };

  return (
    <div style={{ marginBottom: "50px" }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const utility = {
            electricity_rate: e.target.electric.value,
            water_rate: e.target.water.value,
            id: id,
          };
          await axios
            .patch(CONFIG.API_URL + "/api/utility", utility, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((res) => {
              if (res.data.success) {
                setSeverity("success");
                setAlert(res.data.msg);
                return;
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
          setEdit(false);
        }}
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
        <Grid container sx={{ pt: 5 }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: 3,
              "@media (max-width:700px)": {
                px: 0,
              },
            }}
          >
            <Typography variant="h6">
              Electric Utility
              <Iconify
                icon="healthicons:electricity-outline"
                style={{ color: "green" }}
              />
            </Typography>
            <Typography variant="body2">Set the rate per killowatts</Typography>

            <TextField
              name="electric"
              onWheelCapture={(e) => e.target.blur()}
              value={electric}
              onChange={(e) => setElectric(e.target.value)}
              sx={{ mt: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
              disabled={edit ? false : true}
              label="kWh Rate"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: 3,
              "@media (max-width:700px)": {
                px: 0,
              },
            }}
          >
            <Typography variant="h6">
              Water Utility
              <Iconify icon="ion:water-outline" style={{ color: "green" }} />
            </Typography>
            <Typography variant="body2">
              Set the rate per Cubic meter
            </Typography>
            <TextField
              onWheelCapture={(e) => e.target.blur()}
              value={water}
              onChange={(e) => setWater(e.target.value)}
              sx={{ mt: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
              disabled={edit ? false : true}
              label="CUM Rate"
              name="water"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              px: 3,
              textAlign: "center",
              "@media (max-width:700px)": {
                px: 0,
              },
            }}
          >
            <Typography variant="body2">
              As of Today, {fDateWord(new Date())}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              px: 3,
              textAlign: "center",
              mt: 3,
              "@media (max-width:700px)": {
                px: 0,
              },
            }}
          >
            {edit && (
              <Button variant="contained" type="submit" sx={{ float: "right" }}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
      {!edit && (
        <Button
          type="button"
          variant="contained"
          sx={{
            float: "right",
            mr: 3,
            "@media (max-width:700px)": {
              mr: 0,
            },
          }}
          onClick={handleClick}
        >
          Edit
        </Button>
      )}
    </div>
  );
}
