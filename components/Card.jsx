import React from "react";
import styles from "../styles/Card.module.css";
import Image from "next/image";

const Card = () => {
  return (
    <>
      <div className={`${styles.cardContainer} class="p-2 mb-2 bg-gray-100`}>
        <div className={styles.iconBox}>
          <img className={styles.buyIcon} src="/img/buy.png" alt="buy icon" />
        </div>
        <div className="m-4">
          <img className="w-60 m-auto" src="/img/trans.png" alt="epoxy products" />
        </div>
        <div className="w-58 m-4">
          <h2 className="m-0.5 text-gray-600 text-sm font-bold">
            something stuffs here
          </h2>
          <h2 className="m-0.5 text-gray-600 text-sm font-bold">
            something stuffs
          </h2>
          <h2 className={`${styles.price} m-0.5 font-bold`}>Rs 3000</h2>
        </div>
      </div>
    </>
  );
};

export default Card;
