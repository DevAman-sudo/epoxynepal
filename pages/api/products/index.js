import connectMongo from "../../../database/conn";
import Product from "../../../model/product";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

 // GET REQUEST
 if (req.method == "POST") {

  const { id } = req.body

  try {
    // Find a user by ID in the database
    const product = await Product.findOne({ id });

    if (!product) {
      // Return a 404 error if user is not found
      res.status(404).json({ message: "Products not found" });
    } else {
      // Return the user as a JSON response
      res.status(200).json({
        data: product 
      });
    }
  } catch (error) {
    // Return a 500 error if there's a server error
    res.status(500).json({ message: "Server error" });
  }
} 

else {
  res.status(405).json({ message: "Method not Allowed" })
}

}
