import connectMongo from "../../../database/conn";
import Users from "../../../model/user"

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

//   get method 
  if (method == 'GET') {
    
    try {
      // Find a user by ID in the database
      const user = await Users.find()

      // console.log(signups)

      if (!user) {
        // Return a 404 error if user is not found
        res.status(404).json({ message: "User not found" });
      } else {
        // Return the user as a JSON response
        res.status(200).json(user);
      }
    } catch (error) {
      // Return a 500 error if there's a server error
      res.status(500).json({ message: "Server error" });
    }

  } 

  // post request  
  
    
   else {
    res.status(405).json({ message: 'Method not allowed' });
  }
 
}
