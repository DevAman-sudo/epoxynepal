import connectMongo from "../../../database/conn";
import Tranding from "../../../model/tranding";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  // GET REQUEST
  if (req.method == "GET") {
    try {
      // Find a user by ID in the database
      const product = await Tranding.find();

      if (!product) {
        // Return a 404 error if user is not found
        res.status(404).json({ message: "Products not found" });
      } else {
        // Return the user as a JSON response
        res.status(200).json(product);
      }
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }
  }
  // POST REQUEST
  else if (req.method == "POST") {
    try {
      const { productName } = req.body;
      const { productDescription } = req.body;
      const { productPrice } = req.body;
      const { productCategory } = req.body;
      const { url } = req.body;

      const product = new Tranding({
        name: productName,
        description: productDescription,
        price: productPrice,
        category: productCategory,
        image: url,
      });
      const savedProduct = await product.save();

      res.status(200).json({
        message: "Product created successfully",
        data: savedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // DELETE REQUEST
  else if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      const deletedProduct = await Tranding.findByIdAndDelete(id);

      if (!deletedProduct) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json({
          message: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // Invalid request method
  else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
