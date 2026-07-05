import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken =
    localStorage.getItem("access") ||
    sessionStorage.getItem("access");

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;