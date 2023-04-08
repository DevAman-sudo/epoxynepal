import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from 'buffer';
import Cookies from "js-cookie";

import Users from '../../../model/user'
import connectMongo from "../../../database/conn";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;
  const uniqueID = uuidv4(); // generates a new UUID


  if (method === "POST") {

    const name = req.body;
    const email = req.body;
    const password = req.body;
    const key = Buffer.from(password).toString('base64');
    
    try {
      // Check if user already exists in the database
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      } else {
        // Generate a verification token
        const token = jwt.sign(uniqueID, process.env.JWT_SECRET);

        // Send a verification email to the user
        const verificationLink = `${process.env.HOST}:${process.env.PORT}/signup/verify?token=${token}`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Verify your email address',
          html: `<p style="color: #333;">Please click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({
          message: "Verification email sent.",
          token,
          key
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}
