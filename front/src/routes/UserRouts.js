import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import Home from "../pages/Home";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Login from "../pages/Login";
import TermsCondition from "../component/TermsOfService/TermsCOndition";
import PrivacyPolacy from "../component/PrivacyPolacy/PrivacyPolacy";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Profile from "../profile/Profile";
import DeleteAccount from "../profile/DeleteAccount";
import Orders from "../profile/Orders";
import GameDetails from "../pages/GameDetails";
import Cart from "../pages/Cart";
import Blog from "../component/Blog";

// const stripePromise = loadStripe("pk_test_51RlOu04MsbsH6KuURrRtTgj0lZCjFnmdn5A64CpHOHaPl8UwFGlX6jsYe9K9x4XUUSOIeUSisEM3aV5lriLPEw0300n0menKM3");

// Create a wrapper for Payment with Elements
// const PaymentWithStripe = (props) => (
//   <Elements stripe={stripePromise}>
//     <Payment {...props} />
//   </Elements>
// );

const UserRouts = () => {
  // const userId = localStorage.getItem("ottuserId");
  // const location = useLocation();
  // const [detailsPage, setDetailsPage] = useState(false);

  // useEffect(() => {
  //   setDetailsPage(location.pathname.includes("/gamedetails"));
  // }, [location.pathname]);

  return (
    <div>
      {<Header />}
      <Routes>
        {/* <Route path='/home' element={<Home />}> </Route> */}
        <Route path='/' element={<Home />}> </Route>
        <Route path='/login' element={<Login />}> </Route>
        <Route path='/games' element={<Products />}> </Route>
        <Route path='/gamedetails/:id' element={<GameDetails />}> </Route>
        <Route path='/contact' element={<Contact />}> </Route>
        <Route path='/cart' element={<Cart />}> </Route>
        <Route path='/about' element={<About />}> </Route>
        <Route path='/blog' element={<Blog />}> </Route>
        <Route path="/termsCondition" element={<TermsCondition />}></Route>
        <Route path="/privacyPolicy" element={<PrivacyPolacy />}></Route>
        <Route path='/profile' element={<Profile />}>
          <Route path="delete" element={<DeleteAccount />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      {<Footer />}
    </div>
  );
};

export default UserRouts;