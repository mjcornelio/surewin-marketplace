// @mui
import { styled } from "@mui/material/styles";
import { Typography, Box, Grid, Paper, Slide } from "@mui/material";
// hooks
// components
import Page from "../components/Page";
import Logo from "../components/Logo";
// sections
import LoginForm from "../sections/auth/login/LoginForm";
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
    <Page title="Login">
      {currentUser && currentUser.user_role === "admin"
        ? navigate("/dashboard")
        : navigate("/payments")}
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
              margin: "20px auto ",
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
              sx={{ m: "auto", minHeight: "500px", position: "relative" }}
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
                  my: "100px",
                  px: 5,
                  "@media (max-width:700px)": {
                    px: 3,
                  },
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Sign in
                </Typography>

                <LoginForm />
              </Box>
            </Grid>
            <Footer />
          </Grid>
        </Slide>
      </RootStyle>
    </Page>
  );
}
