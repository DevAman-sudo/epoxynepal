import nodemailer from "nodemailer";
import Subscriber from "../../../model/subscriber";

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { method, body } = req;

  if (method === "POST") {
    // Save the subscriber's email to the database
    try {
      await Subscriber.create({ subscriber: body.email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to save subscriber" });
    }

    // Send an email to the subscriber
    const message = {
      from: process.env.EMAIL_USER,
      to: body.email,
      subject: "You are now subscribed",
      html: `
        <h1>Welcome to Our Newsletter</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will receive regular updates and news from us.</p>
        <p>If you have any questions, feel free to contact us.</p>
      `,
    };

    try {
      await transporter.sendMail(message);
      return res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to send email" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
