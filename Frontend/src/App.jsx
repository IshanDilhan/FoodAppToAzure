import { useLocation } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantProfile from './pages/RestaurantProfile';
import RestaurantMenu from './pages/RestaurantMenu';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AllApprovedRestaurants from './components/AllApprovedRestaurants';
import RestaurantCategoriesSection from './components/RestaurantCategoriesSection';
import MenuAddForm from './components/MenuAddForm';
import PopularMenuSection from './components/PopularMenuSection';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from "./pages/MyOrdersPage";
import UserProfile from './components/UserProfile';
import CheckoutSuccess from './pages/CheckoutSuccess';

import EmailVerification from "./Delivery/emailverify";
import LocationForm from "./Delivery/LocationForm";
import VehicleForm from "./Delivery/VehicleForm";
import VehicleInfoForm from "./Delivery/VehicleInfoForm";
import ProfilePhotoForm from "./Delivery/ProfilePhotoForm";
import PersonalInfoForm from "./Delivery/PersonalInfoForm";
import ReviewRegister from "./Delivery/ReviewRegister";
import RiderInfo from "./Delivery/riderInfo";
import RiderDashboard from "./Delivery/riderDashboard";

import MenuReviewPage from './pages/MenuReviewPage';
import ReviewForm from './pages/ReviewFormPage';

function App() {
  const location = useLocation();

  // List of paths where Navbar should be hidden
  const hideNavbarPaths = [
    "/restaurant/profile",
    "/rider/rider-dashboard"
  ];

  // If you want to hide for all /restaurant/profile routes (including params), use startsWith:
  const hideNavbar = hideNavbarPaths.some(path =>
    location.pathname === path || location.pathname.startsWith(path + "/")
  );

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path="/restaurant/profile/:id" element={<RestaurantMenu />} />
        <Route path="/restaurant/profile" element={<RestaurantProfile />} />
        <Route path="/restaurant/all" element={<AllApprovedRestaurants />} />
        <Route path="/restaurant/category" element={<RestaurantCategoriesSection />} />
        <Route path="/menu-add" element={<MenuAddForm />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />

        <Route path="/riderverify" element={<EmailVerification />} />
        <Route path="/rider/location" element={<LocationForm />} />
        <Route path="/rider/vehicle" element={<VehicleForm />} />
        <Route path="/rider/vehicle-info" element={<VehicleInfoForm />} />
        <Route path="/rider/profile-photo" element={<ProfilePhotoForm />} />
        <Route path="/rider/personal-info" element={<PersonalInfoForm />} />
        <Route path="/rider/review-info" element={<ReviewRegister />} />
        <Route path="/rider/rider-info" element={<RiderInfo />} />
        <Route path="/rider/rider-dashboard" element={<RiderDashboard />} />

        <Route path="/menu/:menuId/reviews" element={<MenuReviewPage />} />
        <Route path="/menu/:menuId/add-review" element={<ReviewForm />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
