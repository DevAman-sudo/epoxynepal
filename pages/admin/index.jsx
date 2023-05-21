import Cookies from "js-cookie";
import Router from "next/router";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import format from "date-fns/format";

import Loading from "../../components/Loading";

const admin = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [signups, setSignups] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [totalSalesCost, setTotalSalesCost] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);

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
  

  // get total sales
  const totalSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/sales");
      setTotalSalesCost(response.data.totalSales);
      setSalesData(response.data.salesData);
    } catch (error) {
      console.log(error);
      setMessage("Internet connection not stable. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  useEffect(() => {
    totalSales();
  }, []);

  // get orders details
  const getOrders = async () => {
    try {
      const response = await axios.get("/api/admin/orders");
      setOrderData(response.data);
    } catch (error) {
      console.log(error);
      setMessage("Internet connection not stable. ");
      setShowAlert(true);
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  useEffect(() => {
    getOrders();
  }, []);

  // get users
  const getUsers = async () => {
    const response = await fetch("/api/admin");
    setLoading(false);
    const userData = await response.json();
    setUserData(userData);
  };
  // render users
  const renderUsers = () => {
    useEffect(() => {
      getUsers();
    }, []);
    return userData.slice(0, 5).map((user) => (
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

  // set weekely signups
  useEffect(() => {
    const getSignups = async () => {
      try {
        const res = await axios.get("/api/admin/signups");
        setSignups(res.data.signups);
      } catch (error) {
        console.log(error);
      }
    };
    getSignups();
  }, []);

  return (
    <div>
      {/* loading page  */}
      {loading ? <Loading /> : null}

      {/* Popup alert */}
      {showAlert && (
        <div className="fixed top-0 left-0 lg:left-auto right-0 z-50 p-4">
          <div className="mx-auto max-w-sm bg-white rounded-lg shadow-lg flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 5a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 100-2 1 1 0 000 2zM5.78 14.55a4.002 4.002 0 01-1.513-1.513A5.984 5.984 0 013 10a6 6 0 1111.268 3H13a1 1 0 00-1 1v1a1 1 0 102 0v-1a3 3 0 00-3-3h-.268A5.992 5.992 0 015.78 14.55zM10 12a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="mt-2 mx-2 text-sm text-gray-500">{message}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex overflow-hidden bg-white pt-16">
          <div
            id="main-content"
            className="h-full w-full bg-gray-50  overflow-y-auto"
          >
            <main>
              <div className="pt-6 px-4">
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                  <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8  2xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          Rs {totalSalesCost.toLocaleString("en-IN")}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Sales this week
                        </h3>
                      </div>
                    </div>
                    <div id="main-chart"></div>
                  </div>
                  <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8 ">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Latest Transactions
                        </h3>
                        <span className="text-base font-normal text-gray-500">
                          This is a list of latest transactions
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        <a
                          href="/admin/payment"
                          className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-md p-2"
                        >
                          View all
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col mt-8">
                      <div className="overflow-x-auto rounded-md">
                        <div className="align-middle inline-block min-w-full">
                          <div className="shadow overflow-hidden sm:rounded-md">
                            <p>NOTE: amount without shipping cost</p>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Transaction
                                  </th>
                                  <th
                                    scope="col"
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Date & Time
                                  </th>
                                  <th
                                    scope="col"
                                    className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {orderData.slice(0, 10).map((order) => (
                                  <tr>
                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                                      Payment from{" "}
                                      <span className="font-semibold">
                                        {order.user.name}
                                      </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                    {format(new Date(order.dateOrdered), "MM/dd/yyyy")}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                      Rs{" "}
                                      {order.totalPrice.toLocaleString("en-IN")}
                                    </td>
                                  </tr>
                                ))}
                                
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          2,340
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          New products this week
                        </h3>
                      </div>
                      <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                        14.6%
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          245
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          Visitors Today
                        </h3>
                      </div>
                      <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                        32.9%
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div> */}
                  <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          {signups && <span>{signups}</span>}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          User signups this week
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* latest coustomers  */}
                <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
                  <div className="bg-white shadow rounded-md mb-4 p-4 sm:p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold leading-none text-gray-900">
                        Latest Customers
                      </h3>
                      <a
                        href="/admin/viewUsers"
                        className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-md inline-flex items-center p-2"
                      >
                        View all
                      </a>
                    </div>
                    {/* chart  */}
                    {renderUsers()}
                  </div>
                  <div className="bg-white shadow rounded-md p-4 sm:p-6 xl:p-8 ">
                    <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">
                      Acquisition Overview
                    </h3>
                    <div className="block w-full overflow-x-auto">
                      <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                          <tr>
                            <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                              Top Channels
                            </th>
                            <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap">
                              Users
                            </th>
                            <th className="px-4 bg-gray-50 text-gray-700 align-middle py-3 text-xs font-semibold text-left uppercase border-l-0 border-r-0 whitespace-nowrap min-w-140-px"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="text-gray-500">
                            <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                              Organic Search
                            </th>
                            <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                              5,649
                            </td>
                            <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  30%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-cyan-600 h-2 rounded-sm w-[30%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr className="text-gray-500">
                            <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                              Referral
                            </th>
                            <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                              4,025
                            </td>
                            <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  24%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-orange-300 h-2 rounded-sm w-[24%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr className="text-gray-500">
                            <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                              Direct
                            </th>
                            <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                              3,105
                            </td>
                            <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  18%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-teal-400 h-2 rounded-sm w-[18%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr className="text-gray-500">
                            <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                              Social
                            </th>
                            <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                              1251
                            </td>
                            <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  12%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-pink-600 h-2 rounded-sm w-[12%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr className="text-gray-500">
                            <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                              Other
                            </th>
                            <td className="border-t-0 px-4 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4">
                              734
                            </td>
                            <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  9%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-indigo-600 h-2 rounded-sm w-[9%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr className="text-gray-500">
                            <th className="border-t-0 align-middle text-sm font-normal whitespace-nowrap p-4 pb-0 text-left">
                              Email
                            </th>
                            <td className="border-t-0 align-middle text-xs font-medium text-gray-900 whitespace-nowrap p-4 pb-0">
                              456
                            </td>
                            <td className="border-t-0 align-middle text-xs whitespace-nowrap p-4 pb-0">
                              <div className="flex items-center">
                                <span className="mr-2 text-xs font-medium">
                                  7%
                                </span>
                                <div className="relative w-full">
                                  <div className="w-full bg-gray-200 rounded-sm h-2">
                                    <div className="bg-purple-500 h-2 rounded-sm w-[7%]"></div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default admin;
