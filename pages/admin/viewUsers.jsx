import Cookies from "js-cookie";
import Router from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Loading from "../../components/Loading";
import styles from "../../styles/Navbar.module.css";

const viewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  // check auth
  async function checkAuth() {
    const isAdmin = Cookies.get("isAdmin");

    if (isAdmin === false || !isAdmin) {
      useEffect(() => {
        Router.push("/login?message=Nice Try");
      }, []);
    }
  }
  checkAuth();

  // get users
  const getUsers = async () => {
    const userData = await axios.get("/api/admin");
    setUserData(userData.data);
  };
  // call getUsers on component mount
  useEffect(() => {
    getUsers();
  }, []);

  // calculate the number of users
  const userCount = userData.length;

  // render users
  const renderUsers = () => {
    return userData.map((user, index) => (
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          <li className="py-3 sm:py-4 border border-b-2 px-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0 md:flex justify-evenly">
                <p className="flex-1 text-sm font-medium text-gray-900 truncate">
                  ID: {user._id}
                </p>
                <p className="flex-1 text-sm font-medium text-gray-900 truncate">
                  NAME: {user.name}
                </p>
                <p className="flex-1 text-sm text-gray-500 truncate">
                  <a
                    href="/cdn-cgi/l/email-protection"
                    className="__cf_email__"
                    data-cfemail="17727a767e7b57607e7973646372653974787a"
                  >
                    EMAIL: {user.email}
                  </a>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    ));
  };

  // loading screen
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      {/* loading page  */}
      {loading ? <Loading /> : null}

      <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
        <div className="bg-white shadow rounded-md mb-4 p-4 sm:p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold leading-none text-gray-900">
              Customers -- <span>{userCount}</span>
            </h3>
          </div>
          {/* chart  */}
          {renderUsers()}
        </div>
      </div>
    </div>
  );
};

export default viewUsers;
