import React from "react";
import Image from "next/image";

const ProductCard = () => {
  const [productData, setProductData] = useState([]);

  // get products
  const getProducts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/admin/products`);

      setProductData(response.data);
    } catch (error) {
      setProductData([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {productData.map((product) => (
        <div className="p-2 w-36 md:w-52 max-h-68 m-1 md:p-1 bg-milky">
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
          <div className="w-40 m-2 flex flex-col-reverse justify-end">
            <h2 className={` m-0.5 `}>
              <div className="flex">
                <span className="text-sm ml-2">Rs </span>

                <div className="flex justify-around">
                  {product.discount === 0 ? (
                    <span className="text-lg mx-2 font-500 text-green-900 tracking-wider whitespace-normal">
                      {product.price.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <>
                      <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal line-through">
                        {product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg ml-2 font-500 text-green-900 tracking-wider whitespace-normal">
                        {(product.price -
                          (product.price / 100) * product.discount).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </h2>
            <h2 className="m-0.5 text-gray-600 font-700 text-sm tracking-widest capitalize mr-8">
              {product.name}
            </h2>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCard;
