import React from "react";
import styles from "../styles/Cat.module.css";

const CatCard = () => {
  return (
    <>
      <div className="m-1 h-auto">
        <div className="w-20 bg-milky md:w-58 p-1 rounded-full h-auto m-auto">
          <img
            className="w-full h-full"
            src="/img/trans.png"
            alt="epoxy products"
          />
        </div>
        <div className="w-14 md:w-58 m-4 flex justify-center">
          <h2 className="m-0.5 font-bold text-sm">something</h2>
        </div>
      </div>
    </>
  );
};

export default CatCard;
