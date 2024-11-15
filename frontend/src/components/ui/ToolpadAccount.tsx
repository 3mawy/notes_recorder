import { AuthenticationContext, SessionContext } from "@toolpad/core/AppProvider";
import { Account } from "@toolpad/core/Account";
import { useAppDispatch, useAppSelector } from "../../store/hooks/storeHooks";
import { logout, selectUser } from "../../features/auth/authSlice";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import AccountCircle from "@mui/icons-material/AccountCircle";

const CustomMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const handleClickItem = (path: string) => {
    navigate(path);
  };
  return (
    <Card sx={{ minWidth: "16rem" }}>
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="body2" noWrap>
          Welcome, {user?.first_name || user?.last_name ? `${user?.first_name} ${user?.last_name}` : `User`}.
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuList
        disablePadding
        sx={{
          p: 1,
          gap: 0.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuItem key={"profile"} onClick={() => handleClickItem("/userProfile")}>
          <AccountCircle />
          Profile
        </MenuItem>
      </MenuList>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 1 }}>
        <Button fullWidth color="error" size="medium" variant="text" onClick={() => dispatch(logout())}>
          Logout
        </Button>
      </Box>
    </Card>
  );
};

export default function ToolpadAccount() {
  const user = useAppSelector(selectUser);

  const session = {
    user: {
      name: `${user?.first_name} ${user?.last_name}`,
      email: user?.email,
    },
  };

  const authentication = useMemo(() => {
    return {
      signIn: () => {},
      signOut: () => {},
    };
  }, []);
  return (
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>
        <Account
          slots={{
            popoverContent: CustomMenu,
          }}
        />
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
  );
}
