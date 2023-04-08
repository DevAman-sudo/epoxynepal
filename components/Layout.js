import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      {children}

      <Footer />

      <button
        className={`${
          isVisible ? "opacity-100" : "opacity-0"
        } fixed bottom-4 right-4 bg-themecolor text-white p-4 rounded-full shadow-md transition-opacity duration-300 z-20`}
        onClick={handleToTopClick}
      >
        <svg
          className="w-6 h-6 fill-current rotate-180"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.293 7.293a1 1 0 0 0-1.414 0L10 13.586 3.707 7.293a1 1 0 1 0-1.414 1.414l7 7a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414z" />
        </svg>
      </button>
    </>
  );
};

export default Layout;
