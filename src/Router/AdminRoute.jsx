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

    const fetchRole = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/${user.email}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("saad-token")}`,
            },
          },
        );

        const data = await res.json();
        setRole(data?.data?.role || null);
      } catch (error) {
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user?.email]);

  if (loading || roleLoading) {
    return <PageLoader />;
  }

  // allow admin and super-admin
  if (role === "admin" || role === "super-admin") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
