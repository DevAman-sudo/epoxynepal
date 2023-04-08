import { info } from "autoprefixer";
import React from "react";

const Details = () => {

  const info = {
    id: 1,
    name: 'something here',
    img: 'img/trans.png',
    desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi consectetur consequuntur repudiandae temporibus voluptatibus veniam, doloribus obcaecati provident iusto ipsum deleniti nesciunt est, officiis doloremque sit nihil at aperiam laboriosam!',
    price: 5000
  }

  return (
    <div>
      <div className=" mt-8 flex w-full h-auto text-gray-700">
          <h1 className="mt-auto font-bold float-left m-4 text-3xl">
            Most Trending Product
          </h1>
        </div>
      <div>
        <div className="min-w-screen min-h-screen bg-themecolor flex items-center p-5 md:p-10 overflow-hidden relative">
          <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 md:p-20 mx-auto text-gray-800 relative md:text-left">
            <div className="md:flex items-center -mx-10">
              <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                <div className="relative">
                  <img
                    src={info.img}
                    className="w-full relative z-50"
                    alt=""
                  />
                  <div className="border-4 border-themecolor absolute top-10 bottom-10 left-10 right-10 z-0"></div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-10">
                <div className="mb-10">
                  <h1 className="font-bold uppercase text-2xl mb-5">
                    {info.name}
                  </h1>
                  <p className="text-sm">
                    {info.desc}
                  
                  </p>
                </div>
                <div>
                  <div className="inline-block align-bottom mr-5">
                    <span className="text-2xl leading-none align-baseline">Rs</span>
                    <span className="font-bold text-5xl leading-none align-baseline">
                      {info.price}
                    </span>
                    
                  </div>
                  <div className="inline-block align-bottom">
                    <button className="bg-themecolor text-white hover:text-gray-300 rounded-full px-10 py-2 font-semibold">
                      <i className="mdi mdi-cart -ml-2 mr-2"></i> BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default Details;
