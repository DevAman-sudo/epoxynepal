// models/Product.js

import mongoose from 'mongoose';

const trandingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
});

const Tranding = mongoose.models.Tranding || mongoose.model('Tranding', trandingSchema);

export default Tranding;
