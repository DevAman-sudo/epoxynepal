import React from "react";
import ShopByArtCard from "./ShopByArtCard";

const ShopByArt = () => {
  return (
    <>
      <div className=" bg-pink py-4 w-screen mx-auto">
        <div className="flex w-full h-auto text-gray-700">
          <h1 className="mt-auto font-bold float-left m-4 text-3xl ">
            Shop By Art
          </h1>
          <p className=" mt-auto font-bold ml-auto m-4 underline">view all</p>
        </div>

        <div className="mx-8 flex justify-evenly flex-wrap">
          <ShopByArtCard/>
          <ShopByArtCard/>
          <ShopByArtCard/>
          <ShopByArtCard/>
          <ShopByArtCard/>
          <ShopByArtCard/>
        </div>
      </div>
    </>
  );
};

export default ShopByArt;