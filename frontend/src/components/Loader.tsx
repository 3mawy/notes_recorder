import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import type { FC } from "react";

type LoaderProps = {
  message?: string;
  size?: number;
};

const Loader: FC<LoaderProps> = ({ message = "", size = 40 }) => {

  return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100svh"
        width="100svw"
        sx={{backgroundColor:"white"}}
      >
        <CircularProgress size={size} color={"primary"} />
        <Typography variant="body2" color="text.secondary" mt={2}>
          {message}
        </Typography>
      </Box>
  );
};

export default Loader;
