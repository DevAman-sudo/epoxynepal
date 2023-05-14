import React, { useState, useEffect } from "react";
import axios from "axios";

const SelectProduct = () => {
  const [data, setData] = useState([]);

  // fetching discounted product
  const getProduct = async () => {
    try {
      const response = await axios.get("/api/discount");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      {data.slice(0, 5).reverse().map((item) => (
        <a href={`/products/details?ids=${item._id}`} >
        <div className="w-[90%] md:w-[80%] bg-pink flex mx-auto my-4 justify-evenly align-center px-4 py-8">
          <div className="w-1/2 leading-6">
            <p className="text-center">UP TO</p>
            <h1 className="text-center text-4xl bolder">
              {item.discount}%<span className="text-sm mx-1">OFF</span>
            </h1>
            <h3 className="text-center text-sm">
              SELECT <br /> PRODUCT
            </h3>
          </div>
          <div className="w-[40%] md:w-[15%] h-auto my-auto">
            <img src={item.image} />
          </div>
        </div>
        </a>
      ))}
    </div>
  );
};

export default SelectProduct;
