import { Fragment, useContext, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Loading from "../../components/Loading.jsx";
import { useEffect } from "react";
import axios from "axios";
import Router, { useRouter } from "next/router.js";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import AppContext from "../../components/context/AppContext.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductPage = () => {
  const router = useRouter();
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [queryMessage, setQueryMessage] = useState("");

  // get products
  const getProducts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/admin/products`, {
        params: {
          page: currentPage, // Pass the current page number as a query parameter
          limit: itemsPerPage, // Pass the number of items per page as a query parameter
        },
      });

      setLoading(false);

      setProductData(response.data);
      setData(response.data);
      return response;
    } catch (error) {
      setLoading(false);
      setMessage("Internet connection not Stable. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    getProducts();
  }, []);

  // get category
  const getCategory = async () => {
    try {
      const categoryData = await axios.get("/api/admin/category");
      setCategoryData(categoryData.data);
    } catch (error) {
      setMessage("Internet Connection not Stable");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(true);
      }, 3000);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  // handle category search
  const handleCategorySearch = async (category) => {
    setCurrentPage(1);

    try {
      const data = await getProducts();

      const filteredData = data.data.filter(
        (item) => item.category.toLowerCase() == category.toLowerCase()
      );

      setProductData(filteredData);
    } catch (error) {
      setLoading(false);
      setMessage("Internet connection not Stable. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // redirection to show details page
  const showDetails = async (id) => {
    try {
      Router.push(`/products/details?ids=${id}`);
    } catch (error) {
      setLoading(false);
      setMessage("Something went Wrong. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // category search filter redirected from home
  const { category } = router.query;
  useEffect(() => {
    if (category) {
      handleCategorySearch(category);
    }
  }, [category]);

  // get newset Products
  const getNewest = async () => {
    try {
      const response = await axios.get(`/api/admin/products`);
      const data = response.data.slice(-10).reverse();
      setProductData(data);
      setMobileFiltersOpen(false);
    } catch (error) {
      console.error("Failed to get newest products:", error);
    }
  };

  // get price low to high
  const getPriceLow = async () => {
    try {
      const response = await axios.get(`/api/admin/products`);
      const sortedData = response.data.sort((a, b) => a.price - b.price);
      setProductData(sortedData);
      setMobileFiltersOpen(false);
    } catch (error) {
      console.error("Failed to get newest products:", error);
    }
  };

  // get price high to low
  const getPriceHigh = async () => {
    try {
      const response = await axios.get(`/api/admin/products`);
      const sortedData = response.data.sort((a, b) => b.price - a.price);
      setProductData(sortedData);
      setMobileFiltersOpen(false);
    } catch (error) {
      console.error("Failed to get newest products:", error);
    }
  };

  // handle search filter
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(context.query.toLowerCase())
    );

    if (filteredData.length === 0) {
      setQueryMessage("Product not found.");
    } else {
      setQueryMessage(context.query);
    }
    setProductData(filteredData);
  }, [context.query]);

  return (
    <div className="bg-white">
      {/* loading page  */}
      {loading ? <Loading /> : null}

      {/* popup alert */}
      {showAlert && (
        <div className="fixed top-0 left-0 lg:left-auto right-0 z-50 p-4">
          <div className="mx-auto max-w-sm bg-white rounded-lg shadow-lg flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 5a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 100-2 1 1 0 000 2zM5.78 14.55a4.002 4.002 0 01-1.513-1.513A5.984 5.984 0 013 10a6 6 0 1111.268 3H13a1 1 0 00-1 1v1a1 1 0 102 0v-1a3 3 0 00-3-3h-.268A5.992 5.992 0 015.78 14.55zM10 12a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="mt-2 mx-2 text-sm text-gray-500">{message}</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <p className="text-xl font-400 text-grey-500 tracking-wider mt-2">
            Search Query: {queryMessage}
          </p>

          <div className="flex items-baseline justify-between border-b border-gray-200 pt-8 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <div className="text-left">
                <div>
                  <div
                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  >
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <Transition
                  show={mobileFiltersOpen}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <a
                        href="#"
                        className="font-medium text-gray-90 bg-gray-100 block px-4 py-2 text-sm"
                        onClick={getNewest}
                      >
                        Newest
                      </a>
                    </div>
                    <div className="py-1">
                      <a
                        href="#"
                        className="font-medium text-gray-90 bg-gray-100 block px-4 py-2 text-sm"
                        onClick={getPriceLow}
                      >
                        Price: Low to High
                      </a>
                    </div>
                    <div className="py-1">
                      <a
                        href="#"
                        className="font-medium text-gray-90 bg-gray-100 block px-4 py-2 text-sm"
                        onClick={getPriceHigh}
                      >
                        Price: High to Low
                      </a>
                    </div>
                  </div>
                </Transition>
              </div>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 md:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon
                  onClick={() => setIsOpen(!isOpen)}
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-2 gap-y-10 md:grid-cols-4 md:flex">
              {/* something  */}
              <Transition
                show={isOpen}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <form className="">
                  <h3 className="sr-only">Categories</h3>
                  <ul
                    role="list"
                    className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                  >
                    {categoryData.map((category, index) => (
                      <li key={category._id}>
                        <img
                          className="w-20 h-20 object-cover rounded-full"
                          src={category.image}
                        />
                        <a
                          href="#"
                          onClick={() =>
                            handleCategorySearch(category.category)
                          }
                          className="capitalize bold text-xl tracking-widest"
                        >
                          {category.category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </form>
              </Transition>

              <div className="min-h-96 md:w-[90%] md:ml-auto py-2 rounded-md border-4 border-dashed border-gray-200 h-auto flex justify-evenly flex-wrap">
                {productData
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((product) => (
                    <a
                      onClick={() => showDetails(product._id)}
                      className="flex flex-wrap cursor-pointer"
                    >
                      <div className="p-2 w-36 md:w-52 h-80 aspect-w-1 m-1 md:p-1 bg-milky flex flex-col justify-between  hover:bg-gray-200 transition duration-300 ease-in-out transform-gpu hover:scale-105">
                        <div>
                          <img
                            className="ml-[70%] w-10 h-10 bg-themecolor rounded-full p-2 mt-2"
                            src="/img/buy.png"
                            alt="buy icon"
                            onClick={() => showDetails(product._id)}
                          />
                        </div>
                        <div className="m-4">
                          <img
                            className="w-24 md:w-36 m-auto"
                            src={product.image}
                            alt="epoxy products"
                          />
                        </div>
                        <div className="w-40 m-2 flex flex-col-reverse justify-end">
                          <h2 className={` m-0.5 `}>
                            <div className="flex">
                            <span className="text-sm ml-2">Rs </span>

                            <div className="flex justify-around">
                              {product.discount === 0 ? (
                                <span className="text-lg mx-2 font-500 text-green-900 tracking-wider whitespace-normal">
                                  {product.price}
                                </span>
                              ) : (
                                <div className="flex flex-col md:flex-row">
                                  <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal line-through">
                                    {product.price}
                                  </span>
                                  <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal">
                                    {product.price -
                                      (product.price / 100) * product.discount}
                                  </span>
                                </div>
                              )}
                            </div>
                            </div>
                          </h2>
                          <h2 className="m-0.5 text-gray-600 font-700 text-sm tracking-widest capitalize mr-8">
                            {product.name}
                          </h2>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </section>

          {/* pagination  */}
          <div className="flex justify-center m-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 bg-themecolor hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(productData.length / itemsPerPage)
              }
              className="bg-themecolor hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
