import Cookies from "js-cookie";
import Router from "next/router";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import format from "date-fns/format";

import Loading from "../../components/Loading";
import styles from "../../styles/Navbar.module.css";
import AppContext from "../../components/context/AppContext";

const ViewUsers = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([]);
  const [queryMessage, setQueryMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = Cookies.get("isAdmin");

      if (isAdmin === false || !isAdmin) {
        Router.push("/login?message=Nice Try");
      }
    };

    checkAuth();
  }, []);

  // Get users
  const getUsers = async () => {
    const response = await axios.get("/api/admin/orders");
    const users = response.data;
    setUserData(users);
    setData(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Calculate the number of users
  const userCount = userData.length;

  // Handle search filter and pagination
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item._id.toLowerCase().includes(context.query.toLowerCase())
    );
    if (filteredData.length === 0) {
      setQueryMessage("Data not Found");
    } else {
      setQueryMessage(context.query);
    }
    setUserData(filteredData);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  }, [context.query, data]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render users
  const renderUsers = () => {
    return currentUsers.map((user, index) => (
      <div className="flow-root" key={index}>
        <ul role="list" className="divide-y divide-gray-200">
          <li className="py-3 sm:py-4 border border-b-2 px-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0 md:flex justify-evenly">
                <p className="flex-1 text-sm font-medium text-gray-900 truncate">
                  ID: {user._id}
                </p>
                <p className="flex-1 capitalize text-sm font-medium text-gray-900 truncate">
                  NAME: {user.user.name}
                </p>
                <p className="flex-1 text-sm text-gray-500 truncate">
                  EMAIL:{" "}
                  <a
                    href="/cdn-cgi/l/email-protection"
                    className="__cf_email__"
                    data-cfemail="17727a767e7b57607e7973646372653974787a"
                  >
                    {user.user.email}
                  </a>
                </p>
                <p className="flex-1 text-sm text-gray-500 truncate">
                  DATE: {format(new Date(user.dateOrdered), "MM/dd/yyyy")}
                </p>
                <p className="flex-1 text-sm text-gray-500 truncate">
                  PAYMENT: {user.totalPrice.toLocaleString("en-IN")}
                </p>
                <p>note: amount without shipping cost</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    ));
  };

  // Loading screen
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      {/* Loading page */}
      {loading ? <Loading /> : null}

      <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
        <div className="bg-white shadow rounded-md mb-4 p-4 sm:p-6 h-full">
          <p className="text-xl font-400 text-grey-500 tracking-wider my-2 ">
            Search Query: {queryMessage}
          </p>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold leading-none text-gray-900">
              Customers -- <span>{userCount}</span>
            </h3>
          </div>
          {/* Render users */}
          {renderUsers()}
          
          {/* Pagination */}
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              {Array.from(
                Array(Math.ceil(userData.length / usersPerPage)),
                (item, index) => (
                  <li key={index}>
                    <a
                      className={`${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "text-blue-500"
                      } font-bold block hover:text-white hover:bg-blue-500 py-2 px-3`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
