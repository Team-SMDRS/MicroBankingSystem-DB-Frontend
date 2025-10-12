import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { isTokenExpired } from "../utils/authUtils"; // Adjust path as needed

const PrivateRoute = () => {
  const { token } = useAuth();
  return token && !isTokenExpired(token) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
