import connectMongo from "../../../database/conn";
import { getUsers, postUsers } from "../../../controllers/usersController";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

  // post request  
  if (method === 'POST') {
    postUsers(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
 
}
