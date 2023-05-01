import connectMongo from "../../database/conn";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

  // POST REQUEST
  if (method == 'POST') {

    const id = req.body
    console.log(id)
    

      try {
        
        
    
      } catch (error) {
        // Return a 500 error if there's a server error
        res.status(500).json({ message: "Server error" });
      }
    
  } else {
    res.status(405).json({ message: "Method not Allowed" });
  }
}
