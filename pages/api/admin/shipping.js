import connectMongo from "../../../database/conn";
import Shipping from "../../../model/shipping";

export default async function handler(req, res) {
  try {
    await connectMongo();
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
    return;
  }

  const { method } = req;

  if (method === "GET") {
    try {
      const existingAlerts = await Shipping.find();
      res.status(200).json({ data: existingAlerts });
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else if (method == "POST") {
    try {
      const cost = req.query.cost;
      await Shipping.deleteMany(); // Delete all existing alerts
      const newShipping = new Shipping({ shipping: cost });
      await newShipping.save();
      res
        .status(200)
        .json({ message: "Shipping cost updated successfully"});
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}