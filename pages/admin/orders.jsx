import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Check authentication
  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");

    if (!isAdmin) {
      Router.push("/login?message=Nice Try");
    } else {
      fetchOrders();
    }
  }, []);

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/checkout");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.cartItems[0].name}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Order Date:
                  </span>
                  {order.createdAt ? (
                    <span className="ml-auto text-sm font-medium text-gray-800">
                      {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                    </span>
                  ) : (
                    <span className="ml-auto text-sm font-medium text-gray-800">
                      N/A
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Shipping Address:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    {order.address}, {order.apartment}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Total Amount:
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-800">
                    Rs
                    {order.cartItems.reduce(
                      (total, item) => total + item.price * item.num + 1500,
                      0
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Items:
                  </h3>
                  <ul className="list-disc list-inside">
                    {order.cartItems.map((item) => (
                      <li key={item._id} className="flex items-center mb-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover mr-2 mx-2"
                        />
                        <span className="traking-wider">{`${item.name} x ${item.num}`}</span>
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
