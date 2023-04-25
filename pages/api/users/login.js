import connectMongo from "../../../database/conn";
import Users from "../../../model/user";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;

  // post request
  if (method === "POST") {
    const { email, password } = req.body;

    // verifying admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

      res.status(200).json({message: "isAdminTrue"})

    } else {
      try {
        // Check if user exists in the database
        const user = await Users.findOne({ email });
        const isMatch = bcrypt.compare(password, user.password)
        console.log(isMatch)
        console.log(password)

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials." });
        }

        // Create a JWT token with the user's ID
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });

        // Return the user data along with the token
        res.status(200).json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ message: "Internal server error." });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
