import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
export default function Layout({ children, cartCount }) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <>{children}</>
      <Footer />
    </>
  );
}
