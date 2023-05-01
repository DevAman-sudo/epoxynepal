import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppContext from "../components/context/AppContext";
import Loading from "../components/Loading";
import Cookies from "js-cookie";

const cart = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [productData, setProductData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shipingCost, setShipingCost] = useState(1500);

  useEffect(() => {
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

    const getProducts = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`/api/admin/products`);

        // Filter the product data based on the IDs in context productData
        const productIds = context.productData.map((item) => item.productId);

        const filteredData = response.data.filter((product) => {
          return productIds.includes(product._id);
        });

        // update products from local storage
        const storeProducts = filteredData;
        const cartItems = JSON.parse(localStorage.getItem("productData"));

        const updatedProducts = storeProducts.map((product) => {
          const cartItem = cartItems.find(
            (item) => item.productId === product._id
          );
          const num = cartItem ? cartItem.num : 0;
          return { ...product, num };
        });

        localStorage.setItem("products", JSON.stringify(updatedProducts));

        // Set the product data from local storage on component mount
        const storedProductData = JSON.parse(localStorage.getItem("products"));
        setProductData(storedProductData || []);

        getTotalPrice();

        setLoading(false);
      } catch (error) {
        console.log(error);
        setMessage("Internet connection not stable.");
        setShowAlert(true);
        setLoading(false);
      }
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    };

    getProducts();
  }, [context.productData]);

  // handle save cart items
  const handleSaveCart = async () => {
   router.push("/gateway")
  };

  // remove items from cart
  function handleDeleteFunction(id) {
    const cartItems = JSON.parse(localStorage.getItem("productData"));

    const updatedCartItems = cartItems.filter((item) => item.productId !== id);

    localStorage.setItem("productData", JSON.stringify(updatedCartItems));
    localStorage.setItem("cartNumber", updatedCartItems.length);

    const cartNumber = localStorage.getItem("cartNumber");
    context.setCartNumber(cartNumber);

    location.reload();
  }

  // showing different page if cart items are 0
  if (context.cartNumber === 0) {
    return (
      <div>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet. Browse our
              products and find something you like.
            </p>
            <a
              href="/products"
              className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md text-sm inline-block"
            >
              Start Shopping
            </a>
          </div>
        </main>
      </div>
    );
  } else {
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

        <div className="min-h-screen h-auto bg-gray-100 py-10">
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-md md:w-2/3">
              {/* product container  */}
              {productData.reverse().map((product) => (
                <div className="justify-between mb-6 rounded-md bg-white p-6 shadow-md sm:flex sm:justify-start">
                  <img
                    src={product.image}
                    alt="product-image"
                    className="w-full rounded-md sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-md font-bold text-gray-900">
                        {product.name}
                      </h2>
                    </div>
                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <div className="flex items-center border-gray-100">
                        <input
                          className="h-8 w-8 border bg-white text-center text-xs outline-none m-auto"
                          type="number"
                          value={product.num}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">
                          Rs {product.price * product.num}{" "}
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                          onClick={() => handleDeleteFunction(product._id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 h-full rounded-md border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">Rs {totalPrice}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">Rs {shipingCost}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-md font-bold">Total</p>
                <div className="">
                  <p className="mb-1 text-md font-bold">
                    Rs {totalPrice + shipingCost}
                  </p>
                </div>
              </div>
              <button
                className="mt-6 w-full rounded-md bg-themecolor py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                onClick={handleSaveCart}
              >
                Check out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default cart;
