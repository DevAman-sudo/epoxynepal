
import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  subscriber: {
    type: String,
    trim: true,
  }
});

// Check if the model already exists before compiling it
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
