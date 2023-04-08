import React from "react";

const Story = () => {
  return (
    <div>
      <div className="flex w-full h-auto text-gray-500 mb-8">
        <h1 className="font-bold float-left m-4 text-3xl mt-8 mb-8">Our story</h1>
      </div>

      <div>
        <div className="flex justify-center items-center px-8">
          <img
            src="img/table.jpg"
            alt="image"
            className=" w-[60%] md:w-[40%] h-auto"
          />
          <div className="shadow-md offset-x-2 offset-y-2 blur-4 flex items-center justify-center ">
            <h1 className="bg-white ml-[-50%] px-8 py-2 text-themecolor font-bold text-xl">
              Who we Are
            </h1>
          </div>
        </div>
        <p className="text-center mx-auto px-8 py-4 md:w-[40%]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam inventore consequatur error voluptatibus nihil a eos voluptatum adipisci ea porro dicta aspernatur assumenda, sit distinctio impedit debitis. Sequi, provident similique?</p>
      </div>

      <div>
        <div className="flex flex-row-reverse justify-center items-center px-8 ">
          <img
            src="img/table.jpg"
            alt="image"
            className=" w-[60%] md:w-[40%] h-auto"
          />
          <div className="shadow-md offset-x-2 offset-y-2 blur-4 flex items-center justify-center z-10">
            <h1 className="bg-white mr-[-50%] px-8 py-2 text-themecolor font-bold text-xl">
              Who we Are
            </h1>
          </div>
        </div>
        <p className="text-center px-8 mx-auto py-4 md:w-[40%]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam inventore consequatur error voluptatibus nihil a eos voluptatum adipisci ea porro dicta aspernatur assumenda, sit distinctio impedit debitis. Sequi, provident similique?</p>
      </div>

      <div>
        <div className="flex justify-center items-center px-8">
          <img
            src="img/table.jpg"
            alt="image"
            className=" w-[60%] md:w-[40%] h-auto"
          />
          <div className="shadow-md offset-x-2 offset-y-2 blur-4 flex items-center justify-center ">
            <h1 className="bg-white ml-[-50%] px-8 py-2 text-themecolor font-bold text-xl">
              Who we Are
            </h1>
          </div>
        </div>
        <p className="text-center px-8 mx-auto  py-4 md:w-[40%]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam inventore consequatur error voluptatibus nihil a eos voluptatum adipisci ea porro dicta aspernatur assumenda, sit distinctio impedit debitis. Sequi, provident similique?</p>
      </div>

      <div>
        <div className="flex flex-row-reverse justify-center items-center px-8">
          <img
            src="img/table.jpg"
            alt="image"
            className=" w-[60%] md:w-[40%] h-auto"
          />
          <div className="shadow-md offset-x-2 offset-y-2 blur-4 flex items-center justify-center ">
            <h1 className="bg-white mr-[-50%] px-8 py-2 text-themecolor font-bold text-xl z-10">
              Who we Are
            </h1>
          </div>
        </div>
        <p className="text-center px-8 mx-auto py-4 md:w-[40%]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam inventore consequatur error voluptatibus nihil a eos voluptatum adipisci ea porro dicta aspernatur assumenda, sit distinctio impedit debitis. Sequi, provident similique?</p>
      </div>

    </div>
  );
};

export default Story;
