import React, { useContext } from "react";
import styles from "../styles/Navbar.module.css";
import Cookies from "js-cookie";
import Router from "next/router";

const NavLinks = () => {
  const userId = Cookies.get("user_id");
  const token = Cookies.get("token");
  const isAdmin = Cookies.get("isAdmin");

  console.log(isAdmin);

  // handle logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("isAdmin");
    Router.push("/");
  };

  if (isAdmin == "false") {
    return (
      <>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/" aria-current="page">
            Home
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/products" aria-current="page">
            Shop
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/story" aria-current="page">
            Our Story
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/contact" aria-current="page">
            Contact
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            onClick={handleLogout}
            aria-current="page"
          >
            Logout
          </a>
        </li>
      </>
    );
  } else if (isAdmin == "true") {
    return (
      <>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/" aria-current="page">
            Home
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/products" aria-current="page">
            Shop
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/story" aria-current="page">
            Our Story
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/contact" aria-current="page">
            Contact
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/login" aria-current="page">
            Login
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/crudProducts"
            aria-current="page"
          >
            Products
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/viewUsers"
            aria-current="page"
          >
            Users
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/alert"
            aria-current="page"
          >
            Alert
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/tranding"
            aria-current="page"
          >
            Tranding
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/category"
            aria-current="page"
          >
            Category
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a
            className={styles.menuItems}
            href="/admin/projects"
            aria-current="page"
          >
            Projects
          </a>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/" aria-current="page">
            Home
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/products" aria-current="page">
            Shop
          </a>
        </li>
        <li className="mt-4 md:mt-0 border-b text-themecolor border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/story" aria-current="page">
            Our Story
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/contact" aria-current="page">
            Contact
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/login" aria-current="page">
            Login
          </a>
        </li>

        <li className="mt-4 md:mt-0 border-b border-gray-400 md:border-none pb-2 md:pb-0">
          <a className={styles.menuItems} href="/signup" aria-current="page">
            SignUp
          </a>
        </li>
      </>
    );
  }
};

export default NavLinks;
