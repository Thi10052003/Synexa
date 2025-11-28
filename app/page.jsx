'use client'
import React, { useEffect } from "react";
import { trackEvent } from "@/lib/tracker";

import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {

  useEffect(() => {
    trackEvent("page_view", {
      page: "home"
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
      </div>
      <Footer />
    </>
  );
};

export default Home;
