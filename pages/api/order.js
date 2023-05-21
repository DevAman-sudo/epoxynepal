import connectMongo from "../../database/conn";
import Order from "../../model/order";
import OrderItem from "../../model/orderItem";
import Product from "../../model/product";
import User from "../../model/user";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { method } = req;

  //   get method
  if (method == "GET") {
    try {
      const order = await Order.find({ user: req.query.id })
        .populate("user", "name")
        .populate({
          path: "orderItems",
          populate: {
            path: "product",
            populate: "category",
          },
        });

      res.status(200).send(order);
    } catch (error) {
      console.log(`Error from Order.js => ${error}`);
      res.status(500).json("Internal Server Error");
    }
  }

  // post request
  else if (method == "POST") {
    try {
      const orderItemsIds = await Promise.all(
        req.body.cartItems.map(async (orderItem) => {
          let newOrderItem = new OrderItem({
            quantity: orderItem.num,
            product: orderItem._id,
          });

          newOrderItem = await newOrderItem.save();

          return newOrderItem._id;
        })
      );

      const totalPrices = await Promise.all(
        orderItemsIds.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate(
            "product",
            "price"
          );
          const totalPrice = orderItem.product.price * orderItem.quantity;
          return totalPrice;
        })
      );

      const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

      let order = new Order({
        orderItems: orderItemsIds,
        address: req.body.address,
        apartment: req.body.apartment,
        phone: req.body.phoneNumber,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.userId,
      });
      order = await order.save();

      // Send an email to the subscriber
      const message = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Order Received",
        html: `
          <h1>New Order Received</h1>
          <p>Dear Admin,</p>
          <p>A new order has been placed with the following details:</p>
          <h2>Order Details</h2>
          <ul>
            <li>Order ID: ${order._id}</li>
            <li>Address: ${req.body.address}</li>
            <li>Apartment: ${req.body.apartment}</li>
            <li>Phone: ${req.body.phoneNumber}</li>
            <li>Total Price: Rs${totalPrice.toFixed(2)}</li>
          </ul>
          <p>Thank you!</p>
        `,
      };

      await transporter.sendMail(message);
      res.status(200).json(order);
    } catch (error) {
      console.log(`Error from Order.js => ${error}`);
      res.status(500).json("Internal Server Error");
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
