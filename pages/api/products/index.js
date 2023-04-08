import connectMongo from "../../../database/conn";
// import Product from "../../../model/product";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  if (method === "POST") {

    console.log(req.body)

    // try {

    //     const newProduct = new Product({
    //         productName,
    //         productDescription,
    //         productCategory,
    //         productPrice,
    //         url,
    //       });

    //     const savedProduct = await newProduct.save();

    //     res.status(201).json(savedProduct);

    // } catch(error) {
    //     console.log(error)
    //     res.status(500).json("Internal Server Error")
    // }

  
  }
}
