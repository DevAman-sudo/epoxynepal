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
          <p className=" mt-auto font-bold ml-auto m-4 underline">view all</p>
        </div>

        <div className={styles.productContainer}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default Products;
