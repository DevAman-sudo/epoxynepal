import React, { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";
import axios from "axios";
import AppContext from "../../components/context/AppContext";

const discount = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [updateCategory, setUpdateCategory] = useState("");
  const [data, setData] = useState([]);
  const [queryMessage, setQueryMessage] = useState("");
  const [discount, setDiscount] = useState({});
  const [hiddenId, setHiddenId] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [cost, setCost] = useState(0)

  // Check authentication
  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");

    if (!isAdmin) {
      Router.push("/login?message=Nice Try");
    }
  }, []);

  // Loading screen
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageSrc(file);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!productName) {
      errors.productName = "Product name is required";
    }

    if (!productDescription) {
      errors.productDescription = "Product description is required";
    }

    if (!productPrice) {
      errors.productPrice = "Product price is required";
    }

    if (!imageSrc) {
      errors.imageSrc = "Product image is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        // creating a user
        const formData = new FormData();
        formData.append("file", imageSrc);
        formData.append("upload_preset", "uploads");

        const uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/dvo1ngia7/image/upload",
          formData
        );

        const { url } = uploadImage.data;

        const data = {
          productName,
          productDescription,
          productCategory,
          productPrice,
          url,
        };

        const response = await axios.post("/api/admin/products", data);
        setMessage(response.data.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setLoading(false);
        getProducts();
      } catch (error) {
        setMessage("Something Went Wrong. ");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setLoading(false);
      }
    }
  };

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

  // get products
  const getProducts = async () => {
    const productData = await axios.get("/api/admin/products");
    setProductData(productData.data);
    setData(productData.data);

    // set message
    setMessage(productData.data.message);
    if (!productData.data.message === "") {
      setTimeout(() => {
        setShowAlert(true);
      }, 3000);
    }
  };
  // call getUsers on component mount
  useEffect(() => {
    getProducts();
  }, []);

  // adding discount
  const handleDiscountChange = (id, value) => {
    setHiddenId(id);
    setDiscount((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleButtonSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = discount;
    const discountRate = data[hiddenId];

    try {
      const response = await axios.post(
        `/api/discount?id=${hiddenId}&discount=${discountRate}`
      );
      getProducts();
      setMessage(response.data.message);
      setShowAlert(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Internet not Stable");
      setShowAlert(true);
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // handle shipping 
  const handleInputChange = (event) => {
    setShippingCost(event.target.value);
  };

  const getShippingCost = async () => {

    try {

      const response = await axios.get('/api/admin/shipping')
      setCost(response.data.data[0].shipping)

    } catch (error) {
      setMessage("Internet Connection not Stable. ")
      setShowAlert(true)
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

  }
  useEffect( () => {
    getShippingCost()
  }, [])

  const handleShipping = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      const response = await axios.post(`/api/admin/shipping?cost=${shippingCost}`);
      setMessage(response.data.message)
      getShippingCost()
      setShowAlert(true)
      setLoading(false)
    } catch (error) {
     setMessage("Something went Roung. ")
      setShowAlert(true)
      setLoading(false)
    }
  };

  // handle search query
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(context.query.toLowerCase())
    );

    if (filteredData.length == 0) {
      setQueryMessage("Users not Found");
    } else {
      setQueryMessage(context.query);
    }
    setProductData(filteredData);
  }, [context.query]);

  return (
    <div>
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

      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mt-8 mb-4">Product CRUD Page</h1>

        {/* shipping cost form  */}
        <form onSubmit={handleShipping} >
          <label
            htmlFor="shipping-cost"
            className="block font-medium text-gray-700"
          >
            Shipping Cost
          </label>
          <p>{ cost }</p>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="shipping-cost"
              type="number"
              required
              value={shippingCost}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 px-2 border mx-2 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter shipping cost"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload Shipping Cost
            </button>
          </div>
        </form>

        {/* products data  */}
        <div className="my-8">
          <h2 className="text-xl font-bold mb-4">Discount List</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-bold text-left">Image</th>
                  <th className="px-4 py-2 font-bold text-left">ID</th>
                  <th className="px-4 py-2 font-bold text-left">Name</th>
                  <th className="px-4 py-2 font-bold text-left">Discount</th>
                  <th className="px-4 py-2 font-bold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((product, index) => (
                  <tr>
                    <td className="border px-4 py-2">
                      {" "}
                      <img src={product.image} />{" "}
                    </td>
                    <td className="border px-4 py-2">{product._id}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.discount} %</td>
                    <td className="border px-4 py-2">
                      <form
                        className="flex items-center"
                        onSubmit={handleButtonSubmit}
                      >
                        <input
                          type="number"
                          className="border rounded px-2 py-1 mr-2"
                          id={product._id}
                          onChange={(event) =>
                            handleDiscountChange(
                              product._id,
                              event.target.value
                            )
                          }
                          value={discount[product._id] || ""}
                          required
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                          Apply Discount
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default discount;
