import Jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { method } = req;

  if (method == "POST") {
    const token = req.query.token;
    const decodedToken = await Jwt.verify(`${token}`, process.env.JWT_SECRET);

    if (decodedToken) {
      res.status(200).json({message: "allGood"});
    } else {
      res.status(401).json({message: "token not valid"});
    }
  }
}
