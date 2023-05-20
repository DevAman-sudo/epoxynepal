import connectMongo from "../../database/conn"
import Order from "../../model/order";
import OrderItem from "../../model/orderItem";
import Product from "../../model/product";
import User from "../../model/user";

export default async function handler(req, res) {
  await connectMongo().catch(() => {
    res.status(405).json({ error: "database error" });
  });

  const { method } = req

//   get method 
  if (method == 'GET') {

    try {

      const order = await Order.find({ user: req.query.id})
      .populate('user', 'name')
      .populate({ 
          path: 'orderItems', populate: {
              path : 'product', populate: 'category'} 
          });
  
      res.status(200).send(order);

    } catch (error) {
      console.log(`Error from Order.js => ${error}`)
      res.status(500).json("Internal Server Error")
    }
    

  } 

  // post request  
  else if (method == 'POST') {

    try {

        const orderItemsIds = Promise.all(req.body.cartItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity: orderItem.num,
                product: orderItem._id
            })
    
            newOrderItem = await newOrderItem.save();
    
            return newOrderItem._id;
        }))
        const orderItemsIdsResolved =  await orderItemsIds;
        
    
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))
    
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            address: req.body.address,
            apartment: req.body.apartment,
            phone: req.body.phoneNumber,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.userId,
        })
        order = await order.save();
    
        res.status(200).json(order);

    } catch (error) {
        console.log(`Error from Order.js => ${error}`)
        res.status(500).json("Internal Server Error")
    }
 
  }
    
   else {
    res.status(405).json({ message: 'Method not allowed' });
  }
 
}
