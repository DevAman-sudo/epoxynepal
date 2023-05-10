import React, { useState, useEffect } from "react";
import axios from "axios";

const Categorize = () => {
  const [categoryData, setCategoryData] = useState([]);

  // get category
  const getCategory = async () => {
    try {
      const categoryDatas = await axios.get("/api/admin/category");
      setCategoryData(categoryDatas.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="bg-pink py-4">
      <div className="flex w-full h-auto text-gray-700">
        <h1 className="mt-auto font-bold float-left m-4 text-3xl">
          Shop By Category
        </h1>
      </div>

      <div className="flex justify-left overflow-scroll">
        {categoryData.map((category, index) => (
          <a href={`/products?category=${category.category}`}>
            <div key={index} className=" shadow-md m-2 p-4 rounded-md">
              <div className="w-24 h-24 md:w-40 md:h-40  mx-auto overflow-hidden">
                <img
                  className="w-full h-full object-cover p-4"
                  src={category.image}
                  alt={category.category}
                />
              </div>
              <div className="text-center mt-2">
                <h2 className="font-700 text-sm sm:text-base tracking-widest">
                  {category.category}
                </h2>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categorize;
