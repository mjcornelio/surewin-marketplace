import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useResponsive from "../../../hooks/useResponsive";
// material
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
  Stack,
} from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 70,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
  "&.MuiToolbar-root": {
    margin: "24px 0",
  },
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 340,
  transition: theme.transitions.create(["box-shadow"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { boxShadow: theme.customShadows.z8 },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholder: PropTypes.string,
  btn: PropTypes.string,
  to: PropTypes.string,
};

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  placeholder,
  btn,
  to,
  search,
}) {
  const isMobile = useResponsive("down", "sm");
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          style={{ width: "100%" }}
        >
          {search !== false && (
            <Tooltip title="Search">
              <SearchStyle
                value={filterName}
                onChange={onFilterName}
                placeholder={placeholder}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
              />
            </Tooltip>
          )}

          {btn && (
            <div style={{ width: "100%" }}>
              <Tooltip title={btn}>
                <Link
                  to={to}
                  style={{
                    textDecoration: "none",
                    float: "right",
                  }}
                >
                  {isMobile ? (
                    <IconButton
                      variant="contained"
                      aria-label="add"
                      size="small"
                      sx={{
                        backgroundColor: "#003A6B",
                        "&:hover": {
                          backgroundColor: "#2065D1",
                        },
                      }}
                    >
                      <Iconify
                        icon="akar-icons:plus"
                        sx={{
                          fontWeight: "bold",
                          color: "#ffffff",
                          width: 20,
                          height: 20,
                        }}
                      />
                    </IconButton>
                  ) : (
                    <Button variant="contained">
                      <Iconify
                        icon="akar-icons:plus"
                        sx={{
                          color: "#ffffff",
                          width: 20,
                          height: 20,
                          mr: "5px",
                        }}
                      />
                      {btn}
                    </Button>
                  )}
                </Link>
              </Tooltip>
            </div>
          )}
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton style={{ position: "absolute", right: "24px" }}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : null}
    </RootStyle>
  );
}
