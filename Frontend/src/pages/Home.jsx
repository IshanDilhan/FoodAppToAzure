import React from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import AppDownloadSection from "../components/AppDownloadSection";
import CategoriesSection from "../components/CategoriesSection";
import DealsSection from "../components/DealsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import PartnerRiderSection from "../components/PartnerRiderSection";
import PopularRestaurants from "../components/PopularRestaurants";
import StatsSection from "../components/StatsSection";
import PopularMenuSection from "../components/PopularMenuSection";



export default function Home() {
  return (
    <div className="bg-[#FAFAFA]">
      <TopBar />
      <HeroSection />
      <DealsSection />
      <PopularMenuSection/>
      <PopularRestaurants />
      <AppDownloadSection />
      <PartnerRiderSection />
      <FAQSection />
      <StatsSection />
      <AppDownloadSection/>
      
     
  
    </div>
  );
}
