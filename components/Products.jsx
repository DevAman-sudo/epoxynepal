import React from "react";
import Card from "./Card";
import styles from "../styles/Products.module.css";

const Products = () => {
  return (
    <>
      <div className="mt-8">
        <div className="flex w-full h-auto text-gray-700">
          <h1 className="mt-auto font-bold float-left m-4 text-3xl">
            Our Products
          </h1>
          <a href="/products" className="ml-auto mt-auto m-4">
            <p className="font-bold underline">view all</p>
          </a>
        </div>

        <div className={`${styles.productContainer} flex items-center justify-center`}>
          <Card />
        </div>
      </div>
    </>
  );
};

export default Products;
