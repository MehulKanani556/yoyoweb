import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import Home from "../pages/Home";

// const stripePromise = loadStripe("pk_test_51RlOu04MsbsH6KuURrRtTgj0lZCjFnmdn5A64CpHOHaPl8UwFGlX6jsYe9K9x4XUUSOIeUSisEM3aV5lriLPEw0300n0menKM3");

// Create a wrapper for Payment with Elements
// const PaymentWithStripe = (props) => (
//   <Elements stripe={stripePromise}>
//     <Payment {...props} />
//   </Elements>
// );

const UserRouts = () => {
  const location = useLocation();
  // const userId = localStorage.getItem("ottuserId");

  return (
    <>
     {/* <Header /> */}
      <Routes>
        {/* <Route path='/home' element={<Home />}> </Route> */}
        <Route path='/' element={<Home />}> </Route>
      </Routes>
     {/* <Footer /> */}
    </>
  );
};

export default UserRouts;