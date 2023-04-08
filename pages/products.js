import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loading from "../components/Loading.jsx";
import { useEffect } from "react";
import axios from "axios";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";

import ProductCard from "../components/ProductCard.jsx";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
//   {
//     id: "color",
//     name: "Color",
//     options: [
//       { value: "white", label: "White", checked: false },
//       { value: "beige", label: "Beige", checked: false },
//       { value: "blue", label: "Blue", checked: true },
//       { value: "brown", label: "Brown", checked: false },
//       { value: "green", label: "Green", checked: false },
//       { value: "purple", label: "Purple", checked: false },
//     ],
//   },
//   {
//     id: "category",
//     name: "Category",
//     options: [
//       { value: "new-arrivals", label: "New Arrivals", checked: false },
//       { value: "sale", label: "Sale", checked: false },
//       { value: "travel", label: "Travel", checked: true },
//       { value: "organization", label: "Organization", checked: false },
//       { value: "accessories", label: "Accessories", checked: false },
//     ],
//   },
//   {
//     id: "size",
//     name: "Size",
//     options: [
//       { value: "2l", label: "2L", checked: false },
//       { value: "6l", label: "6L", checked: false },
//       { value: "12l", label: "12L", checked: false },
//       { value: "18l", label: "18L", checked: false },
//       { value: "20l", label: "20L", checked: false },
//       { value: "40l", label: "40L", checked: true },
//     ],
//   },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [categoryData, setCategoryData] = useState([])

  // get products
  const getProducts = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/admin/products");
      setLoading(false);
      setProductData(response.data);
      return response

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

    try {

      const data = await getProducts()

      const filteredData = data.data.filter(item => item.category == category)

      setProductData(filteredData)
      
    } catch (error) {
      setLoading(false);
      setMessage("Internet connection not Stable. ");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

  }

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
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

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
                      <a href="#" onClick={() => handleCategorySearch(category.category)} className="capitalize bold text-xl tracking-widest" >{category.category}</a>
                    </li>
                    ))}

                  </ul>
                </form>
              </Transition>

              <div className="min-h-96 md:w-[90%] md:ml-auto py-2 rounded-md border-4 border-dashed border-gray-200 h-auto flex justify-evenly flex-wrap">
                {productData.map((product, index) => (
                  <div className="p-2 w-36 md:w-52 max-h-68 m-1 md:p-1 bg-milky flex flex-col justify-between">
                    <div>
                      <img
                        className="ml-[70%] w-10 h-10 bg-themecolor rounded-full p-2 mt-2"
                        src="/img/buy.png"
                        alt="buy icon"
                      />
                    </div>
                    <div className="m-4">
                      <img
                        className="w-24 md:w-36 m-auto"
                        src={product.image}
                        alt="epoxy products"
                      />
                    </div>
                    <div className="w-24 md:w-36 m-4">
                      <h2 className="m-0.5 text-gray-600 text-sm font-bold capitalize">
                        {product.name}
                      </h2>

                      <h2 className="m-0.5 font-bold">Rs {product.price}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="flex justify-center my-4">
            <nav className="inline-flex rounded-md shadow-md overflow-hidden">
              <a
                href="#"
                className="px-3 py-2 bg-milky text-gray-700 rounded-l-md"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="chevron-left w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 5.293a1 1 0 010 1.414L10.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="px-3 py-2 bg-milky text-gray-700">
                1
              </a>
              <a href="#" className="px-3 py-2 bg-milky text-gray-700">
                2
              </a>
              <a href="#" className="px-3 py-2 bg-milky text-gray-700">
                3
              </a>
              <a href="#" className="px-3 py-2 bg-milky text-gray-700">
                4
              </a>
              <span className="px-3 py-2 bg-milky text-gray-700">...</span>
              <a href="#" className="px-3 py-2 bg-milky text-gray-700">
                12
              </a>
              <a
                href="#"
                className="px-3 py-2 bg-milky text-gray-700 rounded-r-md"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="chevron-right w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 14.707a1 1 0 01-1.414-1.414L9.586 10l-5.293-5.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
