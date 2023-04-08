import Users from "../model/user";

// post request /api/users
export async function postUsers(req, res) {
  
  const id = req.query.id

   try {
     // Find a user by ID in the database
     const user = await Users.findById(id)
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
