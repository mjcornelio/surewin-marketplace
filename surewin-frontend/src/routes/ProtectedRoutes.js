import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useValue } from "../context/ContextProvider";

function ProtectedRoutes() {
  const {
    state: { currentUser },
  } = useValue();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
