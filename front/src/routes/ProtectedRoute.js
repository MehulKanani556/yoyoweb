import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { enqueueSnackbar } from "notistack";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  // Adjust this selector to your auth slice
  // const user = useSelector((state) => state.auth.user);
  // const userData = useSelector((state) => state.user.currUser);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("ottToken");
  const userId = localStorage.getItem("ottuserId");
  const location = useLocation();
  const dispatch = useDispatch();


  // if (!token && !userId) {
  //   return (
  //     <Navigate to="/" state={{ from: location, loginPopup: true }} replace />
  //   );
  // }

  // If a requiredRole is specified and user doesn't match, redirect
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default ProtectedRoute;
