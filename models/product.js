const mongoose = require('mongoose');

(async() => mongoose.connect('mongodb://localhost:27017/e-commerce'))();

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;