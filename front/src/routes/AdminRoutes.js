import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminDashboard from "../Admin/AdminDashboard";
import Layout from "../Admin/Layout";
import Category from "../Admin/Category";


const AdminRoutes = () => {

  // const navigate = useNavigate();
  // const role = localStorage.getItem('role');

  // useEffect(() => {
  //   if (role !== 'admin') {
  //     navigate('/')
  //   }
  // }, [role])


  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<AdminDashboard />} /> */}
        <Route path="/category" element={<Category />} />
        {/* <Route path="/movies" element={<Movies />} /> */}
        {/* <Route path="/episodes" element={<Episodes />} /> */}
        {/* <Route path="/user" element={<User />} /> */}
        {/* <Route path="/actors" element={<Actor />} /> */}
        {/* <Route path="/premium" element={<Premium />} /> */}
        {/* <Route path="/Terms-Conditions" element={<TermsConditions />} /> */}
        {/* <Route path="/Privacy-Policy" element={<PrivacyPolicy />} /> */}
        {/* <Route path="/Cookie-Policy" element={<CookiePolicy />} /> */}
        {/* <Route path="/faq" element={<Faq />} /> */}
        {/* <Route path="/transaction" element={<Transaction />} />/ */}
        {/* <Route path="/profile" element={<AdminProfile />} /> */}
        {/* <Route path="/ads" element={<Ads />} /> */}
        {/* <Route path="*" element={<Navigate to="/admin" />} /> */}
      </Routes>
    </Layout>
  );
};

export default AdminRoutes;