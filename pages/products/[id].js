import { info } from "autoprefixer";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";

const Details = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [productData, setProductData] = useState([])

  // getProducts
  const getProducts = async () => {

    setLoading(true)
    const id = Router.query.id;

    try {

      const response = await axios.post('/api/products', id)
      setLoading(false)
      setMessage(response.data.message)
      setShowAlert(true)
      setProductData(response.data.data)

    } catch (error) {
      setLoading(false);
      setMessage("Something Went Wrong. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  useEffect(() => {
    getProducts();
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

      <div>
        <div className="min-w-screen min-h-screen bg-themecolor flex items-center p-5 md:p-10 overflow-hidden relative">
          <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 md:p-20 mx-auto text-gray-800 relative md:text-left">
            <div className="md:flex items-center -mx-10">
              <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                <div className="relative">
                  <img src={productData.image} className="w-full relative z-50" alt="" />
                  <div className="border-4 border-themecolor absolute top-10 bottom-10 left-10 right-10 z-0"></div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-10">
                <div className="mb-10">
                  <h1 className="font-bold uppercase text-2xl mb-5">
                    {productData.name}
                  </h1>
                  <p className="text-sm">{productData.description}</p>
                </div>
                <div>
                  <div className="inline-block align-bottom mr-5">
                    <span className="text-2xl leading-none align-baseline">
                      Rs
                    </span>
                    <span className="font-bold text-5xl leading-none align-baseline">
                      {productData.price}
                    </span>
                  </div>
                  <div className="inline-block align-bottom">
                    <button className="bg-themecolor text-white hover:text-gray-300 rounded-full px-10 py-2 font-semibold">
                      <i className="mdi mdi-cart -ml-2 mr-2"></i> BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
