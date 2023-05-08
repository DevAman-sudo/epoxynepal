import connectMongo from "../../../database/conn";
import Alert from "../../../model/alert";

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
      const existingAlerts = await Alert.find();
      res.status(200).json({ data: existingAlerts });
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else if (method === "POST") {
    try {
      const { alert } = req.body;
      await Alert.deleteMany(); // Delete all existing alerts
      const newAlert = new Alert({ alert });
      await newAlert.save();
      res
        .status(201)
        .json({ message: "Alert created successfully", alert: newAlert });
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
