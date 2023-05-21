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
  const [shippingCost, setShippingCost] = useState(0);
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
      setShippingCost(response.data.data[0].shipping);
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
  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/orders?id=${orderId}`, {
        status,
      });

      fetchOrders();
      setMessage("Status updated sucessfully. ");
      setShowAlert(true);
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

  return (
    <>
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

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div className="bg-white shadow rounded-lg p-4" key={order._id}>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Order #{order._id}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Customer Name:
                </span>
                <span className="ml-auto capitalize text-sm font-medium text-gray-800">
                  {order.user.name}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <span className="ml-auto capitalize text-sm font-medium text-gray-800">
                  {format(new Date(order.dateOrdered), "MM/dd/yyyy")}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Phone Number:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {order.phone}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Email:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {order.user.email}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Shipping Address:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {order.address}, {order.apartment}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Discount:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {order.orderItems[0].product.discount}%
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Total Amount:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  Rs {order.totalPrice}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Shipping Cost:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {shippingCost}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <span className="ml-auto text-sm font-medium text-gray-800">
                  {order.status}
                </span>
              </div>

              {/* Order status update */}
              <div className="flex items-center">
                <select
                  className="bg-gray-200 border border-gray-300 text-gray-600 rounded-md py-2 px-4 mr-2 focus:outline-none"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
               
              </div>

              {/* Order products */}
              <div>
                <h2 className="text-lg font-medium mt-4 mb-2">
                  Order Products:
                </h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item._id}>
                      <span className="text-sm font-medium text-gray-600">
                        Product: {item.product.name}
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-800">
                        Quantity: {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
