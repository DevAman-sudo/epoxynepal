import connectMongo from "../../../../database/conn";
import Category from "../../../../model/category";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;
  const updateCategory = req.body.updateCategory;
  const image = req.body.url;

  //   get method
  if (method == "GET") {
    try {
      // Find a user by ID in the database
      const category = await Category.find();

      // Return the user as a JSON response
      res.status(200).json(category);
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }
  }

  //   post method
  else if (method == "POST") {
    try {
      // Find a user by ID in the database
      const categoryData = await Category.findOne({ category: updateCategory });

      if (categoryData) {
        res.status(200).json({ message: "Already Exist" });
      }

      const category = new Category({
        category: updateCategory,
        image: image
      });

      const savedCategory = await category.save();
      res.status(200).json({ message: "Category added to Database" });
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }
  }

  // DELETE REQUEST
  else if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json({
          message: "Category deleted successfully",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
