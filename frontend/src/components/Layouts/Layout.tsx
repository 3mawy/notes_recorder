import { type Branding } from "@toolpad/core/AppProvider";
import eglogo from "../../assets/logo.png";
import Box from "@mui/material/Box";

const BrandingLogo = () => (
  <Box

  >
    <img src={eglogo} alt="Logo" />
  </Box>
);

export const BRANDING: Branding = {
  title: "",
  logo: <BrandingLogo />,
};
