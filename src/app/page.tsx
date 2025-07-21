"use client";

import React from "react";

import MenuSection from "@/components/HeroContent";
import NavMenu from "@/components/Navmenu";
import Footer from "@/components/Footer";
import CarouselViewer from "@/components/CarouselViewer";

const page = () => {
  return (
    <main className="bg-black/30">
      <NavMenu />
      <CarouselViewer />
      <MenuSection />
      <Footer />
    </main>
  );
};

export default page;
