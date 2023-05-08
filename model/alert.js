
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  alert: {
    type: String,
    required: true,
    trim: true,
  }
});

// Check if the model already exists before compiling it
const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);

export default Alert;

