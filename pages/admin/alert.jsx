import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";
import axios from "axios";

const AlertUploadForm = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Check authentication
  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");

    if (!isAdmin) {
      Router.push("/login?message=Nice Try");
    }
  }, []);

  const handleAlertMessageChange = (event) => {
    setAlertMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Handle alert upload logic here
    try {

        const response = await axios.post('/api/admin/alert', { alert: alertMessage })
       
        setMessage(response.data.message)
        localStorage.setItem("alert", response.data.alert.alert)
        setShowAlert(true)
        setLoading(false)

    } catch (error) {
        console.log(error)
      setLoading(false);
      setMessage("Internet Connection not Stable");
      setShowAlert(true);
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
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

      <form
        onSubmit={handleSubmit}
        className="w-full h-screen flex flex-col md:flex-row items-center max-w-sm mx-auto"
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              htmlFor="alert-message"
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              Alert Message
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              type="text"
              id="alert-message"
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
              placeholder="Enter alert message"
              value={alertMessage}
              onChange={handleAlertMessageChange}
            />
          </div>
        </div>
        <div className="md:flex md:justify-center">
          <div className="md:w-1/3">
            <button
              type="submit"
              className="bg-themecolor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Alert
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AlertUploadForm;
