import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import Home from "../pages/Home";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Login from "../pages/Login";
import TermsCondition from "../component/TermsOfService/TermsCOndition";
import PrivacyPolacy from "../component/PrivacyPolacy/PrivacyPolacy";
import Profile from "../profile/Profile";

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
  const [loginPage, setLoginPage] = useState(false);

  useEffect(() => {
    setLoginPage(location.pathname.includes("/login"));
  }, [location.pathname]);

  return (
    <>
      {!loginPage && <Header />}
      <Routes>
        {/* <Route path='/home' element={<Home />}> </Route> */}
        <Route path='/' element={<Home />}> </Route>
        <Route path='/login' element={<Login />}> </Route>
        <Route path="/termsCondition" element={<TermsCondition/>}></Route>
        <Route path="/privacyPolicy" element={<PrivacyPolacy/>}></Route>
        <Route path='/profile' element={<Profile />}> </Route>
      </Routes>
      {!loginPage && <Footer />}
    </>
  );
};

export default UserRouts;