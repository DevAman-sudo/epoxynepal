import connectMongo from "../../../database/conn";
import Product from "../../../model/product";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

  // POST REQUEST
  if (method == 'POST') {

    const id = req.body.id
    console.log(id)
    

      try {
        // Find a product by ID in the database
        const product = await Product.findOne({ id });

        if (!product) {
          // Return a 404 error if product is not found
          res.status(404).json({ message: "Product not found" });
        } else {
          // Return the product as a JSON response
          res.json({
            data: product,
            message: "Happy Shopping",
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
