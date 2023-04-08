import connectMongo from "../../../database/conn";
import User from "../../../model/user";
import { Buffer } from "buffer";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;

  if (method === "POST") {
    const { userName, userEmail, userKey } = req.body;

    // Decode the string
    const userPassword = Buffer.from(userKey, "base64").toString();
    const userSignedPassword = await bcrypt.hash(userPassword, 10)

    try {
      const existingUser = await User.findOne({ email: userEmail });
      if (existingUser) {
        res.status(200).json({ message: "user already exist" });
      } else {
        const newUser = new User({
          name: userName,
          email: userEmail,
          password: userSignedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: "registration successful" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
