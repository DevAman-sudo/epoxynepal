import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import styles from "../styles/Card.module.css";

const Card = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  // get products
  const getProducts = async () => {
    try {
      const response = await axios.get(`/api/admin/products`);
      setProductData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setProductData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // redirection to show details page
  const showDetails = async (id) => {
    Router.push(`/products/details?ids=${id}`);
  };

  if (loading) {
    // Render a product loading animation here
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="animate-spin -ml-1 mr-3 h-12 w-12 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 016 12H2c0 2.21.898 4.209 2.35 5.657l-.707.707A9.917 9.917 0 000 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-2.454-.902-4.693-2.383-6.43l-.635.635A7.96 7.96 0 0112 20c-4.411 0-8-3.589-8-8z"
          />
        </svg>
      </div>
    );
  }
  return (
    <>
      <div className={`flex md:grid md:grid-cols-5 gap-4`}>
        {productData.slice(0, 8).map((product) => (
          <a
            key={product._id}
            onClick={() => showDetails(product._id)}
            className="flex flex-wrap cursor-pointer"
          >
            <div
              className={`${styles.cardContainer} p-1 mb-2 bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out transform-gpu hover:scale-105 flex flex-col justify-between`}
            >
              <div className={styles.iconBox}>
                <img
                  className={`${styles.buyIcon} z-20`}
                  src="/img/buy.png"
                  alt="buy icon"
                />
              </div>
              <div className="m-2">
                <img
                  className="w-40 m-auto"
                  src={product.image}
                  alt="epoxy products"
                />
              </div>
              <div className="w-40 m-2 flex flex-col-reverse justify-end">
                          <h2 className={` m-0.5 `}>
                            <div className="flex">
                            <span className="text-sm ml-2">Rs </span>

                            <div className="flex justify-around">
                              {product.discount === 0 ? (
                                <span className="text-lg mx-2 font-500 text-green-900 tracking-wider whitespace-normal">
                                  {product.price}
                                </span>
                              ) : (
                                <>
                                  <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal line-through">
                                    {product.price}
                                  </span>
                                  <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal">
                                    {product.price -
                                      (product.price / 100) * product.discount}
                                  </span>
                                </>
                              )}
                            </div>
                            </div>
                          </h2>
                          <h2 className="m-0.5 text-gray-600 font-700 text-sm tracking-widest capitalize mr-8">
                            {product.name}
                          </h2>
                        </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default Card;
