const mongoose = require('mongoose');

(async() => mongoose.connect('mongodb://localhost:27017/e-commerce'))();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;