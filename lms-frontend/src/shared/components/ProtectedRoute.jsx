import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../Stores/authStore";

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const encodedUrl = encodeURIComponent(
    location.pathname + location.search + location.hash
  );

  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?callback=${encodedUrl}`} replace />;
  } else if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  } else return children;
}

export default ProtectedRoute;
