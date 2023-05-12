import connectMongo from "../../../database/conn";
import Users from "../../../model/user";
import moment from "moment";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req;
  const startDate = moment().startOf("week").toISOString();
  const endDate = moment().endOf("week").toISOString();

  //   get method
  if (method == "GET") {
    try {
      // Find a user by ID in the database
      const signups = await Users.countDocuments({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

      // Return the user as a JSON response
      res.status(200).json({ signups });
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }
  }

  // post request
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
