import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ childern }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return childern;
};

export default ProtectedRoute;
