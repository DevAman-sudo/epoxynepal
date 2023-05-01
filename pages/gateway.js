import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import Loading from "../components/Loading";

const gateway = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [productData, setProductData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)
  const [shipingCost, setShipingCost] = useState(1500)

  const userId = Cookies.get("user_id");
  const token = Cookies.get("token");

  // get total price
  function getTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem("products"));

    const totalPrice = cartItems.reduce((accumulator, currentItem) => {
      const productPrice = currentItem.price * currentItem.num;
      return accumulator + productPrice;
    }, 0);

    setTotalPrice(totalPrice);
    return totalPrice;
  }

  useEffect(() => {
    if (!userId && !token) {
      Router.push("/login?message=PLease Login");
    } else {
      // fetch and display cart items
      const getCartItems = async () => {
        setLoading(true);

        try {
          const cartItems = JSON.parse(localStorage.getItem("products"));

          setProductData(cartItems);
          getTotalPrice()
          setLoading(false);

        } catch (error) {
          setLoading(false);
          setMessage("Something went Wrong. ");
          setShowAlert(true);
        }
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      };
      getCartItems();
    }
  }, []);


  return (
    <div>
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

      <div className="min-w-screen min-h-screen bg-gray-50 py-5">
        <div className="px-5">
          <div className="mb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
              Checkout.
            </h1>
          </div>
        </div>
        <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
          <div className="w-full">
            <div className="-mx-3 md:flex items-start">
              <div className="px-3 md:w-7/12 md:pr-10">
                {/* product container  */}
                {productData.reverse().map((product) => (
                  <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                    <div className="w-full flex items-center">
                      <div className="overflow-hidden rounded-md w-16 h-16 bg-gray-50 border border-gray-200">
                        <img src={product.image} alt="" />
                      </div>
                      <div className="flex-grow pl-3">
                        <h6 className="font-semibold uppercase text-gray-600">
                          {product.name}
                        </h6>
                        <p className="text-gray-400">x {product.num}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 text-xl">
                          Rs {product.price * product.num}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mb-6 pb-6 border-b border-gray-200"></div>
                <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                  <div className="w-full flex mb-3 items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Subtotal</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">Rs {totalPrice}</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Dilivery</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">Rs {shipingCost}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                  <div className="w-full flex items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Total</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">Rs {totalPrice + shipingCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* gateway form  */}
              <div className="px-3 md:w-5/12">
               
                <div className="w-full mx-auto rounded-md bg-white border border-gray-200 text-gray-800 font-light mb-6">
                  <div className="w-full p-3 border-b border-gray-200">
                   
                    <div>
                      <div className="mb-3">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">
                          Phone Number
                        </label>
                        <div>
                          <input
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="+977-0000000000"
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">
                          Address
                        </label>
                        <div>
                          <input
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Address"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">
                        Apartment, suite, etc.
                        </label>
                        <div>
                          <input
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Apartment, suite, etc."
                            type="text"
                          />
                        </div>
                      </div>
                     
                    </div>
                  </div>
                 
                </div>
                <div>
                  <button className="block w-full max-w-xs mx-auto bg-themecolor text-white rounded-md px-3 py-2 font-semibold">
                    <i className="mdi mdi-lock-outline mr-1"></i> Cash on Delivery
                  </button>
                </div>
              </div>

              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default gateway;
