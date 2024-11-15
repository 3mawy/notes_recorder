import CssBaseline from "@mui/material/CssBaseline";
import { responsiveFontSizes } from "@mui/material/styles";

import themeCreator from "./theme/base";
import { Outlet } from "react-router-dom";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { BRANDING } from "./components/Layouts/Layout";
import { ToastContainer } from "react-toastify";

const theme = responsiveFontSizes(themeCreator("LightTheme"));
const darkTheme = responsiveFontSizes(themeCreator("DarkTheme"));

function App() {
  return (
    <>
      <CssBaseline />
      <AppProvider branding={BRANDING} theme={{ light: theme, dark: darkTheme }}>
        <Outlet />
        <ToastContainer newestOnTop hideProgressBar pauseOnFocusLoss={false} icon={false} closeButton={false} />
      </AppProvider>
    </>
  );
}

export default App;
