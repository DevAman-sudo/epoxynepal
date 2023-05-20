import connectMongo from "../../../database/conn";
import Order from "../../../model/order";
import OrderItem from "../../../model/orderItem";
import Product from "../../../model/product";
import User from "../../../model/user";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;

  //   get method
  if (method == "GET") {
    try {
      const orderList = await Order.find()
      .populate({
        path: "user",
        model: User,
        select: "-password" // Exclude the password field from the user details
      })
        .populate({ 
          path: 'orderItems', populate: {
              path : 'product', populate: 'category'} 
          })
        .sort({ dateOrdered: -1 });

      res.status(200).json(orderList);
    } catch (error) {
      console.log(`Error from admin Order.js => ${error}`);
      res.status(500).json("Internal Server Error");
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
