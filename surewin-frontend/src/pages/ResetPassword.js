// @mui
import { styled } from "@mui/material/styles";
import { Typography, Box, Grid, Paper, Slide } from "@mui/material";
// hooks
// components
import Page from "../components/Page";
import Logo from "../components/Logo";
// sections
import ResetPasswordForm from "../sections/auth/login/ResetPasswordForm";
import { useValue } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    height: "100vh",
  },
}));

// ----------------------------------------------------------------------

export default function Login() {
  const {
    state: { currentUser },
  } = useValue();
  const navigate = useNavigate();

  return (
    <Page title="Reset Password">
      {currentUser && navigate("/dashboard")}
      <RootStyle>
        <Slide
          direction="down"
          in
          timeout={{ enter: 800 }}
          mountOnEnter
          unmountOnExit
        >
          <Grid
            container
            sx={{
              maxWidth: "1000px",
              margin: "50px auto ",
              maxHeight: "500px",
              height: "100vh",
              padding: "10px",
            }}
          >
            <Grid item xs={12} sx={{ py: 2 }}>
              <Logo src="favicon.ico" sx={{ width: 100, margin: "auto" }} />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ m: "auto", minHeight: "400px", position: "relative" }}
              component={Paper}
              elevation={5}
              square
            >
              <Box
                sx={{
                  height: "10px",
                  width: "100%",
                  backgroundColor: "#77BCFD",
                }}
              />

              <Box
                sx={{
                  mt: "100px",
                  px: 5,
                  "@media (max-width:700px)": {
                    px: 3,
                  },
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Reset Password
                </Typography>

                <ResetPasswordForm />
              </Box>
            </Grid>
            <Footer />
          </Grid>
        </Slide>
      </RootStyle>
    </Page>
  );
}
