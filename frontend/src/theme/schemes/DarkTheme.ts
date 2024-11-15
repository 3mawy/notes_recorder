import {LightTheme, themeColors} from "./LightTheme";
import {createTheme, lighten} from "@mui/material/styles";

export const DarkTheme = createTheme({
  ...LightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: themeColors.primary,
    },
    secondary: {
      main: themeColors.secondary,
    },
    success: {
      main: themeColors.success,
    },
    warning: {
      main: themeColors.warning,
    },
    error: {
      main: themeColors.error,
    },
    info: {
      main: themeColors.info,
    },
    background: {
      default: themeColors.black,
      paper: themeColors.blackDarker,
    },
    text: {
      primary: themeColors.light,
      secondary: lighten(themeColors.light, 0.3),
    },
  },
});
