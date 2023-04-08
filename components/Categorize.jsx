import React from "react";
import CatCard from "./CatCard";

const Categorize = () => {
  return (
    <>
      <div className=" bg-pink py-4">
        <div className="flex w-full h-auto text-gray-700">
          <h1 className="mt-auto font-bold float-left m-4 text-3xl ">
            Shop By Collection
          </h1>
          <p className=" mt-auto font-bold ml-auto m-4 underline">view all</p>
        </div>

        <div className="mx-8 flex justify-evenly flex-wrap">
          <CatCard/>
          <CatCard/>
          <CatCard/>
          <CatCard/>
          <CatCard/>
          <CatCard/>
        </div>
      </div>
    </>
  );
};

export default Categorize;
