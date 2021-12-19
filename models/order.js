const mongoose = require('mongoose');

(async() => mongoose.connect('mongodb://localhost:27017/e-commerce'))();

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    date: { type: Date, default: Date.now() },
    delivered: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;