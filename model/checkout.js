import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User' // The reference to the User model
  },
  cartItems: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      category: {
        type: String
      },
      image: {
        type: String,
        required: true
      },
      num: {
        type: Number,
        default: 1
      }
    }
  ],
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  apartment: {
    type: String
  }
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
