import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";

const Register = () => {
  // auth user
  async function getAuth() {
    const token = Cookies.get("token");
    const userID = Cookies.get("user_id");

    if (token) {
      try {
        const response = await fetch(`/api/middleware/auth?token=${token}`, {
          method: "POST",
        });

        if (response.ok) {
          Router.push({
            pathname: `/profile/${userID}`,
          });
        }
      } catch (error) {
        Router.push({
          pathname: "/login",
          query: { message: "Token Expired, Please LogIn" },
        });
      }
    }
  }
  getAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password should be at least 6 characters long";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const data = {
        name,
        email,
        password,
      };

      setIsLoading(true); // set isLoading to true before making the API call

      try {
        await fetch("/api/users/register", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((responseData) => {
            // handle response data
            Cookies.set("verification_token", responseData.token);
            Cookies.set("user_email", email);
            Cookies.set("user_name", name);
            Cookies.set("user_key", responseData.key);
            setIsLoading(false);

            setMessage(responseData.message)
            setShowAlert(true)
          })
          .catch((error) => {
            // handle error
            setIsLoading(false)
            setMessage('Something went Wrong')
            setShowAlert(true)
          });
      } catch (error) {
        setIsLoading(false);
        setMessage('Something went Wrong')
        setShowAlert(true)
      }
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 9000);
  };

  return (
    <div>
      {/* popup alert */}
      {showAlert && (
        <div className="fixed top-0 left-0 lg:left-auto right-0 z-50 p-4">
        <div className="mx-auto max-w-sm bg-white rounded-lg shadow-lg flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 5a1 1 0 100-2 1 1 0 000 2zm0-10a1 1 0 100-2 1 1 0 000 2zM5.78 14.55a4.002 4.002 0 01-1.513-1.513A5.984 5.984 0 013 10a6 6 0 1111.268 3H13a1 1 0 00-1 1v1a1 1 0 102 0v-1a3 3 0 00-3-3h-.268A5.992 5.992 0 015.78 14.55zM10 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <div className="mt-2 mx-2 text-sm text-gray-500">{message}</div>
          </div>
        </div>
      </div>
      
      )}

      <div className="md:min-h-screen flex flex-col md:items-center md:justify-center bg-milky">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
            Create A New Account
          </div>
          {/* <button className="mt-6 border rounded-md py-2 text-sm text-gray-800 bg-gray-100 hover:bg-gray-200">
            <span className="left-0 top-0 flex items-center justify-center h-full w-10 text-blue-500">
              <i className="fab fa-facebook-f"></i>
            </span>
            <span>SignUp with Facebook</span>
          </button>
          <div className=" mt-10 h-px bg-gray-300">
            <div className=" flex justify-center w-full -mt-2">
              <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                Or SignUp With Email
              </span>
            </div>
          </div> */}
          <div className="mt-10">
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="username"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Username:
                </label>
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center left-0 top-0 h-full w-10 text-gray-400">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>

                  <div className="flex flex-col w-full">
                    <input
                      className="text-sm sm:text-base placeholder-gray-500 p-4 rounded-md border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Name"
                      required
                    />

                    {errors.name && (
                      <span className="text-sm text-rose-600 tracking-wider">
                        {errors.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="email"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  E-Mail Address:
                </label>
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center left-0 top-0 h-full w-10 text-gray-400">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>

                  <div className="flex flex-col w-full">
                    <input
                      className="text-sm sm:text-base placeholder-gray-500  p-4 rounded-md border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email"
                      required
                    />
                    {errors.email && (
                      <span className="text-sm text-rose-600 tracking-wider">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Password:
                </label>
                <div className="flex items-center">
                  <div className="inline-flex items-center justify-center left-0 top-0 h-full w-10 text-gray-400">
                    <span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>

                  <div className="flex flex-col w-full">
                    <input
                      className="text-sm sm:text-base placeholder-gray-500 p-4 rounded-md border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password"
                    />
                    {errors.password && (
                      <span className="text-sm text-rose-600 tracking-wider">
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6 -mt-4"></div>

              <div className="flex w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-themecolor rounded py-2 w-full transition duration-150 ease-in"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 tracking-widest"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  ) : (
                    "REGISTER"
                  )}
                </button>
              </div>
            </form>
          </div>

          {errorMessage && (
            <div className="error my-2">
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center mt-6">
            <a
              href="/login"
              target="_blank"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <span className="ml-2">I have an account?</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
