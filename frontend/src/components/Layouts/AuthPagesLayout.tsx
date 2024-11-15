import { Navigate, Outlet } from 'react-router-dom';
import { isAuth } from "../../features/auth/authSlice";
import type { FC } from "react";
import { useAppSelector } from "../../store/hooks/storeHooks";

const AuthPagesLayout: FC = () => {
  const user = useAppSelector(isAuth);

  return user ?  <Navigate to="/" replace /> : <Outlet /> ;
};

export default AuthPagesLayout;
