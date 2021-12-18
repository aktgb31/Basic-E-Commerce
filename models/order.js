const mongoose = require('mongoose');

(async() => mongoose.connect('mongodb://localhost:27017/e-commerce'))();

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    date: { type: Date, default: Date.now() }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;