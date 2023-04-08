import React from "react";
// import styles from "../styles/Card.module.css";
import Image from "next/image";

const ProductCard = () => {
  return (
    <>
      <div className="p-2 w-36 md:w-52 max-h-68 m-1 md:p-1 bg-milky">
        <div >
          <img className="ml-[70%] w-10 h-10 bg-themecolor rounded-full p-2 mt-2" src="/img/buy.png" alt="buy icon" />
        </div>
        <div className="m-4">
          <img className="w-24 md:w-36 m-auto" src="/img/trans.png" alt="epoxy products" />
        </div>
        <div className="w-24 md:w-36 m-4">
          <h2 className="m-0.5 text-gray-600 text-sm font-bold">
            something stuffs here
          </h2>
          <h2 className="m-0.5 text-gray-600 text-sm font-bold">
            something stuffs
          </h2>
          <h2 className="m-0.5 font-bold">Rs 3000</h2>
        </div>
      </div>
    </>
  );
};

export default ProductCard;