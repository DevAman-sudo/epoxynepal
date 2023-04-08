import connectMongo from "../../../database/conn";
import User from "../../../model/user";
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;
  const { email, password } = req.body

  if (method === "POST") {
    
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found, return an error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();

      // Return a success response
      res.status(200).json({ message: "Password updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
