import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
  shipping: {
    type: Number,
    required: true,
  }
});

// Check if the model already exists before compiling it
const Shipping = mongoose.models.Shipping || mongoose.model('Shipping', shippingSchema);

export default Shipping;