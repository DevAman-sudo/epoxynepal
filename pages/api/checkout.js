import connectMongo from "../../database/conn";
import Cart from "../../model/checkout";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;

  // POST REQUEST
  if (method === "POST") {
    const { userId, cartItems, phoneNumber, address, apartment } = req.body;

    try {
      const filter = { userId: userId };
      const update = { $push: { cartItems: cartItems }, phoneNumber: phoneNumber, address: address, apartment: apartment };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const updatedCart = await Cart.findOneAndUpdate(filter, update, options);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not Allowed" });
  }
}
