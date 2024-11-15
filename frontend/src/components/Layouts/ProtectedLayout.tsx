import ToolpadAccount from "../ui/ToolpadAccount";
import { Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { isAuth } from "../../features/auth/authSlice";
import { useAppSelector } from "../../store/hooks/storeHooks";

const ProtectedLayout = () => {
  const user = useAppSelector(isAuth);

  return user ? (
    <DashboardLayout hideNavigation slots={{ toolbarAccount: ToolpadAccount }}>
        <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default ProtectedLayout;
