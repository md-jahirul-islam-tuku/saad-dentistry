import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import PageLoader from "../Loader/PageLoader";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    fetch(`http://localhost:5000/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data?.data?.role || null);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });
  }, [user?.email]);

  // Wait for both auth and role loading
  if (loading || roleLoading) {
    return <PageLoader />;
  }

  if (role === "admin") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
