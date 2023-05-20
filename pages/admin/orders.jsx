import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { format } from "date-fns";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";
import Router from "next/router";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shipingCost, setShipingCost] = useState(0);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const userID = Cookies.get("user_id");

  // Check authentication
  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");

    if (!isAdmin) {
      Router.push("/login?message=Nice Try");
    } else {
      fetchOrders();
    }
  }, []);

  // Get shipping cost
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

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/orders");
      const ordersData = response.data;
      setOrders(ordersData);
      setLoading(false);
      getShippingCost(); // Call getShippingCost after fetching orders
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await axios(`/api/checkout?id=${orderId}`);
      console.log(response);
      fetchOrders(); // Fetch orders again after updating status
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Loading page */}
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

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
        <div className="flex flex-wrap -mx-4 mb-8">
          {orders.map((order) => (
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-4" key={order._id}>
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Order #{order._id}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Customer Name:
                  </span>
                  <span className="ml-auto capitalize text-sm font-medium text-gray-800">
                    {order.user.name}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Date:
                  </span>
                  <span className="ml-auto capitalize text-sm font-medium text-gray-800">
                    {new Date(order.dateOrdered).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Phone Number:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.phone}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Email:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.user.email}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Shipping Address:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.address}, {order.apartment}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Discount:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.orderItems[0].product.discount}%
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Total Amount:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    Rs{order.totalPrice}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Shipping Cost:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {shipingCost}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Final Price:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.orderItems[0].product.discount > 0
                      ? order.totalPrice -
                        (order.totalPrice *
                          order.orderItems[0].product.discount) /
                          100 +
                        shipingCost
                      : order.totalPrice + shipingCost}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Items:
                  </h3>
                  <ul className="list-disc list-inside">

                    { order.orderItems.map((item) => (
                      <li className="flex items-center mb-2 my-4 border p-2 ">
                        <div className="">
                          <div className="flex">
                            <img
                              src={item.product.image}
                              className="w-14 h-14 object-cover mr-2 mx-2"
                            />
                            <span className="traking-wider">{`${item.product.name} x ${item.quantity}`}</span>
                          </div>
                          <div className="flex overflow-scroll">
                            <button
                              className="mr-2 bg-red-500 hover:bg-delete-600 text-white font-bold py-2 px-4 rounded"
                              onClick={() => updateOrderStatus(item._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
