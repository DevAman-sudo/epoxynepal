// models/Product.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
  discount: {
    type: Number,
    default: 0
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
