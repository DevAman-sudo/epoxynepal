import React, { useState, useEffect } from "react";
import axios from "axios";

const ShopByArt = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // get category
  const getCategory = async () => {
    try {
      const categoryDatas = await axios.get("/api/admin/projects");
      setCategoryData(categoryDatas.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="bg-pink py-4">
      <div className="flex w-full h-auto text-gray-700">
        <h1 className="mt-auto font-bold float-left m-4 text-3xl">
          Our Projects
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="flex justify-left overflow-scroll">
          {categoryData.map((category, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopByArt;
