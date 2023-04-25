import { useState, createContext, useEffect } from "react";
import Layout from "../components/Layout";
import AppContext from "../components/context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [cartNumber, setCartNumber] = useState(0);
  const [productData, setProductData] = useState([]);

  // Retrieve the stored cart number from local storage on component mount
  useEffect(() => {
    const storedCartNumber = localStorage.getItem("cartNumber");
    if (storedCartNumber !== null) {
      setCartNumber(parseInt(storedCartNumber));
    }
  }, []);

  // Store the cart number in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartNumber", cartNumber.toString());
  }, [cartNumber]);

  // Retrieve the stored product data from local storage on component mount
  useEffect(() => {
    const storedProductData = localStorage.getItem("productData");
    if (storedProductData !== null) {
      setProductData(JSON.parse(storedProductData));
      setCartNumber(JSON.parse(storedProductData).length); // set cartNumber to the amount of data present in productData
    }
  }, []);

  // Store the product data in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("productData", JSON.stringify(productData));
    setCartNumber(productData.length); // set cartNumber to the amount of data present in productData
  }, [productData]);

  return (
    <AppContext.Provider
      value={{ cartNumber, setCartNumber, productData, setProductData }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;
