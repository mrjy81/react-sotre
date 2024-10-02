import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
export default function Layout({ children, cartCount, isLogged, setIsLogged }) {
  return (
    <>
      <Navbar
        cartCount={cartCount}
        isLogged={isLogged}
        setIsLogged={setIsLogged}
      />
      <>{children}</>
      {/* <Footer /> */}
    </>
  );
}
