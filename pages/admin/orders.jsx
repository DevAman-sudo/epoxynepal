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

  // get users
  const getUsers = async () => {
    const userData = await axios.get("/api/admin");
    return userData
  };


  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/checkout");

      const userData = await getUsers()
      const data = userData.data
      const filteredData = data.filter(item => item._id === response.data[0].userId)
      const username = filteredData[0].name

      const ordersWithUsername = response.data.map(order => ({
        ...order,
        username
      }));

      setOrders(ordersWithUsername);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await axios(`/api/checkout?id=${orderId}`);
      // fetchOrders();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* loading page  */}
      {loading ? <Loading /> : null}

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
                    {order.username}
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
                      <li
                        key={item._id}
                        className="flex items-center mb-2 my-4 border p-2 "
                      >
                        <div className="">
                          <div className="flex">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 object-cover mr-2 mx-2"
                            />
                            <span className="traking-wider">{`${item.name} x ${item.num}`}</span>
                          </div>
                          <div className="flex overflow-scroll">
                            <button
                              className="mr-2 bg-red-500 hover:bg-delete-600 text-white font-bold py-2 px-4 rounded"
                              onClick={() =>
                                updateOrderStatus(order._id)
                              }
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
