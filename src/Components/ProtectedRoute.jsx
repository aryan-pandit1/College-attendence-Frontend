import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loggedIn =
    localStorage.getItem("isLoggedIn");

  return loggedIn === "true"
    ? children
    : <Navigate to="/" />;
};

export default ProtectedRoute;