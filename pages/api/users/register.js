import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";
import Cookies from "js-cookie";

import Users from "../../../model/user";
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
    const key = Buffer.from(password).toString("base64");

    try {
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
          subject: "Verify your email address",
          html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f3f3f3;
                    margin: 0;
                    padding: 0;
                  }
                  
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  
                  .logo {
                    text-align: center;
                    margin-bottom: 20px;
                  }
                  
                  .logo img {
                    max-width: 200px;
                  }
                  
                  .message {
                    color: #333333;
                  }
                  
                  .button {
                    display: inline-block;
                    background-color: #4caf50;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <p class="message">Please click the button below to verify your email address.</p>
                  <p class="message">
                    If you didn't create an account with us, you can safely ignore this email.
                  </p>
                  <div class="button-container" style="text-align: center;">
                    <a class="button" href="${verificationLink}">Verify Email</a>
                  </div>
                </div>
              </body>
            </html>
          `,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({
          message: "Verification email sent.",
          token,
          key,
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}
