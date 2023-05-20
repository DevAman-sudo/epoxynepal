import React, { useState, useEffect } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";
import axios from "axios";
import Link from "next/link";

const OrderPage = () => {
  // verify user
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

  useEffect(() => {
    getAuth();
  }, []);

  const cookieId = Cookies.get("user_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [orderData, setOrderData] = useState([]);

  // get order history
  const orderHistory = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/order?id=${cookieId}`);

      const filteredOrders = response.data.filter(
        (order) => order._id === Router.query.id
      );

      console.log(filteredOrders);

      setOrderData(filteredOrders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage("Internet Connection not Stable. ");
      setShowAlert(true);
      setLoading(false);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    orderHistory();
  }, []);

  return (
    <>
      {/* loading page */}
      {loading ? <Loading /> : null}

      {/* popup alert */}
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

      <div className="min-h-screen  flex flex-col justify-center items-center">
        <div className="max-w-3xl shadow-lg rounded-lg overflow-hidden w-full">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-semibold">Order Details</h1>
          </div>

          {orderData.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                 
                  <h2 className="text-sm font-semibold">
                    Order #{order._id}
                  </h2>
                  <p className="text-gray-500">
                    Date: {new Date(order.dateOrdered).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="bg-themecolor text-white px-4 py-2 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                {order.orderItems.map((orderItem) => (
                  <div
                    key={orderItem._id}
                    className="flex justify-between items-center py-4"
                  >
                    <div>
                      <img src={ orderItem.product.image } className="h-14 w-14 rounded-full" />
                      <h3 className="text-lg font-semibold flex items-center">
                        {orderItem.product.name}{" "}
                        <span className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 my-auto"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>{" "}
                          {orderItem.quantity}
                        </span>
                      </h3>
                      <p className="text-gray-500">
                        Category: {orderItem.product.category}
                      </p>
                    </div>
                    <p className="text-lg">
                      Rs {orderItem.product.price * orderItem.quantity}{" "}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Discount</h3>
                  <p className="text-lg">
                    {order.orderItems[0].product.discount} %
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Total</h3>
                  <p className="text-lg">
                    Rs{" "}
                    {order.orderItems[0].product.discount > 0
                      ? order.totalPrice - (order.totalPrice *
                        (order.orderItems[0].product.discount / 100))
                      : order.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gray-100 px-6 py-4">
            <Link href={`/profile/orders`} passHref>
              <button className="bg-themecolor hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;

