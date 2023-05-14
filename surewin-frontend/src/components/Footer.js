import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <div
      style={{
        zIndex: 10,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="initial" sx={{ px: 2 }}>
        Copyright ©2022. surewinmarketplace.tech
      </Typography>
    </div>
  );
};
export default Footer;
