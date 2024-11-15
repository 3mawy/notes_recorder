import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazyWrap } from "../utils/lazyWrap";
import AuthPagesLayout from "../components/Layouts/AuthPagesLayout";
import ProtectedLayout from "../components/Layouts/ProtectedLayout";
import App from "../App";

const router = createBrowserRouter([
  {
    Component:App,
    path: "/",
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/notes" replace />,
          },
          {
            path: "notes",
            lazy: lazyWrap(() => import("../features/notes/pages/NotesPage")),
          },
          {
            path: "userProfile",
            lazy: lazyWrap(() => import("../features/profile/pages/Profile")),
          },

        ],
      },
      {
        path: "auth",
        element: <AuthPagesLayout />,
        children: [
          {
            path: "login",
            lazy: lazyWrap(() => import("../features/auth/pages/Login")),
          },
          {
            path: "register",
            lazy: lazyWrap(() => import("../features/auth/pages/Register")),
          },
          {
            path: "verify-2fa",
            lazy: lazyWrap(() => import("../features/auth/pages/Verify2FA")),
          },
          {
            path: "reset-password",
            lazy: lazyWrap(() => import("../features/auth/pages/PasswordRecovery")),
          },
        ],
      },
      {
        path: "*",
        lazy: lazyWrap(() => import("../pages/NoMatchPage")),
      },
    ],
  },
]);

export default router;
