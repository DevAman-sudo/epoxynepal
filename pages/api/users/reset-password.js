import nodemailer from "nodemailer";
import crypto from "crypto"

export default async function handler(req, res) {


  // Send an email with the password reset link to the user's email address
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { method } = req;
  const email = req.body
  

  if (method === "POST") {

    // Generate a unique token
    const token = crypto.randomBytes(20).toString("hex");

    const resetLink = `${process.env.HOST}:${process.env.PORT}/login/verify?token=${token}`;
    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p style="color: #333;">Please click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    try {
      await transporter.sendMail(message);
      res.status(200).json({ token, message: "Email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send email" });
    }
  }
}
