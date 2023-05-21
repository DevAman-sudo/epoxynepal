import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";
import axios from "axios";
import Link from "next/link";
import AppContext from "../../components/context/AppContext";

const Orders = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [shipingCost, setShipingCost] = useState(0);
  const [data, setData] = useState([]);
  const [queryMessage, setQueryMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6); // Number of orders to show per page

  useEffect(() => {
    // Verify user
    async function getAuth() {
      const token = Cookies.get("token");

      if (!token) {
        Router.push({
          pathname: "/login",
          query: { message: "Token Invalid" },
        });
      } else {
        try {
          const response = await fetch(`/api/middleware/auth?token=${token}`, {
            method: "POST",
          });

          if (!response.ok) {
            Router.push({
              pathname: "/login",
              query: { message: "Token Invalid" },
            });
          }
        } catch (error) {
          Router.push({
            pathname: "/login",
            query: { message: "Token Expired" },
          });
        }
      }
    }

    getAuth();
    orderHistory();
  }, []);

  const cookieId = Cookies.get("user_id");

  // get shipping cost
  const getShippingCost = async () => {
    try {
      const response = await axios.get("/api/admin/shipping");
      setShipingCost(response.data.data[0].shipping);
    } catch (error) {
      setMessage("Internet Connection not Stable. ");
      setShowAlert(true);
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    getShippingCost();
  }, []);

  // Get order history
  const orderHistory = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/order?id=${cookieId}`);
      setOrderData(response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage("Internet Connection not Stable.");
      setShowAlert(true);
      setLoading(false);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // handle search filter
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item._id.toLowerCase().includes(context.query.toLowerCase())
    );
    if (filteredData.length === 0) {
      setQueryMessage("Data not Found");
    } else {
      setQueryMessage(context.query);
    }
    setOrderData(filteredData);
  }, [context.query]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Loading page */}
      {loading && <Loading />}

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

      <div className="container mx-auto px-4 py-8">
        <p className="text-xl font-400 text-grey-500 tracking-wider my-2 ">
          Search Query: {queryMessage}
        </p>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-bold mb-4">ID: {order._id}</h2>
              <p className="text-gray-500 mb-2">
                Date: {new Date(order.dateOrdered).toLocaleString()}{" "}
              </p>
              <p className="text-gray-500 mb-2">Status: {order.status}</p>
              <div className="flex justify-between">
                <p className="text-gray-500">
                  Items: {order.orderItems.length}
                </p>
                <p className="text-gray-500">
                  Total: Rs
                  {(order.totalPrice + shipingCost).toLocaleString("en-IN")}
                </p>
              </div>
              <Link href={`/profile/order?id=${order._id}`} passHref>
                <button className="mt-4 bg-themecolor hover:bg-blue-600 text-white py-2 px-4 rounded">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              {Array.from(
                Array(Math.ceil(orderData.length / ordersPerPage)),
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

export default Orders;
