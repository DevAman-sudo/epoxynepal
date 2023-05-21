import connectMongo from "../../../database/conn";
import Order from "../../../model/order";
import moment from "moment";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;

  if (method === "GET") {
    try {
      // Calculate the start and end dates of the current week
      const startOfWeek = moment().startOf("week").toDate();
      const endOfWeek = moment().endOf("week").toDate();

      const totalSales = await Order.aggregate([
        {
          $match: {
            dateOrdered: {
              $gte: startOfWeek,
              $lte: endOfWeek,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalPrice" },
          },
        },
      ]);

      const sales = totalSales.length > 0 ? totalSales[0].totalAmount : 0;

      res.status(200).json({
        totalSales: sales,
      });
    } catch (error) {
      console.log(`Error from admin Order.js => ${error}`);
      res.status(500).json("Internal Server Error");
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
