import connectMongo from "../../database/conn"
import Product from "../../model/product";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

  if (method == 'GET') {

    try {
      // Find all products in the database
      const products = await Product.find();

      const filteredData = products.filter(item => item.discount !== 0);

      // Return the products as a JSON response
      res.status(200).json({
        data: filteredData,
        message: "Discounted products",
      });
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }

  // POST REQUEST
  } else if (method == 'POST') {

    const id = req.query.id
    const discount = req.query.discount || 0;

    try {
      // Find a product by ID in the database
      const product = await Product.findOne({ _id: id });

      if (!product) {
        // Return a 404 error if product is not found
        res.status(404).json({ message: "Product not found" });
      } else {
        // Update the discount value of the product
        product.discount = discount;
        await product.save();

        // Return the updated product as a JSON response
        res.json({
          data: product,
          message: "Discount updated successfully",
        });
      }
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }
    
  } else {
    res.status(405).json({ message: "Method not Allowed" });
  }
}
