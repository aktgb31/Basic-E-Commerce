const { isLoginedUser, isAuthenticatedUser } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

const router = require('express').Router();

router.get('/register', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    res.render('register', data);
}));

router.post('/register', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (user) {
        return next(new ErrorHandler('User with this email already exists', 'register'));
    }
    await User.create({ name: name, email: email, password: password });
    res.redirect('/');
}));

router.get('/login', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    res.render('login', data);
}));

router.post('/login', catchAsyncErrors(async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new ErrorHandler('User with this email does not exist', 'login'));
    }
    if (user.password != password) {
        return next(new ErrorHandler('Wrong password', 'login'));
    }
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.success = 'Login successful';
    res.redirect('/');
}));

router.get('/logout', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    req.session.destroy();
    res.session.success = 'You have been logged out';
    res.redirect('/');
}));

router.get('/cart', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;

    data.loggedIn = true;
    data.userName = req.session.userName;

    const user = await User.findById({ _id: req.session.userId }, ).populate('cart');
    if (user.cart.length > 0)
        data.cart = user.cart
    res.render('cart', data);
}))

router.post('/cart', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.userId;
    await User.findByIdAndUpdate(userId, { $push: { cart: productId } });
    req.session.success = 'Product added to cart';
    res.redirect('/user/cart');
}));

router.post('/cart/delete/', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.userId;
    await User.findByIdAndUpdate(userId, { $pull: { cart: productId } });
    req.session.success = 'Product removed from cart';
    res.redirect('/user/cart');
}));

router.get('/order', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;

    data.loggedIn = true;
    data.userName = req.session.userName;

    const user = await User.findById({ _id: req.session.userId }, ).populate({ path: 'orders', populate: { path: 'productId' } });
    if (user.orders.length > 0)
        data.orders = user.orders
    console.log(data.orders);
    res.render('orders', data);
}));

router.post('/order', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.userId;
    const product = await Product.findById(productId);
    if (product.quantity < 1)
        return next(new ErrorHandler('Product is out of stock', '/user/order'));
    product.quantity--;
    await product.save();
    const order = await Order.create({ userId: userId, productId: productId });
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
    await User.findByIdAndUpdate(userId, { $pull: { cart: productId } });
    req.session.success = 'Product added to orders';
    res.redirect('/user/order');
}))

router.post('/order/cancel', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const orderId = req.body.orderId;
    const userId = req.session.userId;
    const order = await Order.findById(orderId);
    const product = await Product.findById(order.productId);
    product.quantity++;
    await product.save();
    await User.findByIdAndUpdate(userId, { $pull: { orders: orderId } });
    order.cancelled = true;
    await order.save();
    req.session.success = 'Order canceled';
    console.log("I am here");
    res.redirect('/user/order');
}))

module.exports = router;