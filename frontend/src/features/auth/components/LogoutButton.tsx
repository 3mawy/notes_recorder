import { useLogoutUserMutation } from "../services/authEndpoints";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks/storeHooks";
import { logout } from "../authSlice";

const LogoutButton = () => {
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
