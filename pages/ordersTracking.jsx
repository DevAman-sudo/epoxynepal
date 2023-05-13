import Router, { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import Loading from "../components/Loading";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import AppContext from "../components/context/AppContext";

const ordersTracking = () => {
  const context = useContext(AppContext)
  const [loading, setLoading] = useState(true);
  const [circleLoading, setCircleLoading] = useState(true);

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
  getAuth();

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [queryMessage, setQueryMessage] = useState("");
  const [data, setData] = useState([])
  const userID = router.query.userId;

  // get order history
  const orderHistory = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/checkout");
      setCartData(response.data[0].cartItems);
      setData(response.data[0].cartItems);
      setCircleLoading(false);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage("Internet Connection not Stable. ");
      setShowAlert(true);
      setLoading(false);
      setCircleLoading(false);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    orderHistory();
  }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // handle search filter
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(context.query.toLowerCase())
    );

    if (filteredData.length === 0) {
      setQueryMessage("Product not found.");
    } else {
      setQueryMessage(context.query);
    }
    setCartData(filteredData);
  }, [context.query]);

  return (
    <div className="my-8">
      {/* loading page  */}
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

      {/* body  */}
      <div className="px-10 w-screen">
        <p className="text-xl font-400 text-grey-500 tracking-wider mt-2">
          Search Query: {queryMessage}
        </p>

        {/* order history   */}
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <div className="mt-8 md:mt-0">
            <h1 className="text-2xl tracking-widest my-1">Order History</h1>

            {!cartData ? (
              <p className="text-gray-600 tracking-wider my-1">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="flex flex-col mt-4">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Image
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cartData.map((order) => (
                            <tr key={order._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <img
                                  className="md:w-12 md:h-auto"
                                  src={order.image}
                                  alt="img"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {order.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {order.category}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {order.num}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.price * order.num}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  Pending ...
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className=" text-gray-500 tracking-wider ">
                        note: dilivery cost will be added
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ordersTracking;
