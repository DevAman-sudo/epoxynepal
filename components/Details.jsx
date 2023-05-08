import React, { useContext, useEffect, useState } from "react";
import AppContext from "./context/AppContext";
import Router from "next/router";
import axios from "axios";

const Details = () => {
  const context = useContext(AppContext)
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // get products
  const getProducts = async () => {
    try {
      const response = await axios.get(`/api/admin/tranding`);
      setProductData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-8 flex w-full h-auto text-gray-700">
        <h1 className="mt-auto font-bold float-left m-4 text-3xl">
          Most Trending Product
        </h1>
      </div>
      <div>
        {productData.map((product) => (
          <div
            key={product.id}
            className="min-w-screen min-h-screen bg-gray-100 flex items-center p-5 md:p-10 overflow-hidden relative"
          >
            <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 md:p-20 mx-auto text-gray-800 relative md:text-left">
              <div className="md:flex items-center -mx-10">
                <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      className="w-full relative z-10"
                      alt=""
                    />
                    <div className="border-4 border-gray-800 absolute top-10 bottom-10 left-10 right-10 z-0"></div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-10">
                  <div className="mb-10">
                    <h1 className="font-bold uppercase text-2xl mb-5">
                      {product.name}
                    </h1>
                    <p className="text-sm">{product.description}</p>
                  </div>
                  <div>
                    <div className="inline-block align-bottom mr-5">
                      <span className="text-2xl leading-none align-baseline">
                        Rs
                      </span>
                      <span className="font-bold text-5xl leading-none align-baseline">
                        {product.price}
                      </span>
                    </div>
                    {/* <div className="inline-block align-bottom">
                      <button className="bg-gray-800 text-white hover:text-gray-300 rounded-full px-10 py-2 font-semibold"
                      onClick={ () => handleBuy(product.name)} >
                        <i className="mdi mdi-cart -ml-2 mr-2"></i> BUY NOW
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
