import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import PageLoader from "../Loader/PageLoader";

const AuthRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) {
    return <PageLoader fullScreen />;
  }
  if (user) {
    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
  }
  return children;
};

export default AuthRoute;
