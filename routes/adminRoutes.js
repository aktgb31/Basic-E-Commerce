const { ADMIN } = require('../config');
const { isAdmin } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

const router = require('express').Router();

router.get('/login', catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    res.render('adminLogin', data);
}));

router.post('/login', catchAsyncErrors(async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email != ADMIN.EMAIL || password != ADMIN.PASSWORD) {
        return next(new ErrorHandler('Invalid email or password', '/admin/login'));
    }
    req.session.userName = "admin";
    req.session.admin = true;
    req.session.success = 'Login successful';
    res.redirect('/admin/');
}));

router.get('/logout', isAdmin, catchAsyncErrors(async(req, res, next) => {
    req.session.destroy();
    res.session.success = 'You have been logged out';
    res.redirect('/');
}));

router.get('/order', isAdmin, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;

    data.loggedIn = true;
    data.userName = req.session.userName;

    const orders = await Order.find().populate('productId').sort({ date: -1 });
    data.orders = orders;
    console.log(orders)
    res.render('adminOrder', data);
}));

router.post('/order/cancel', isAdmin, catchAsyncErrors(async(req, res, next) => {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    const product = await Product.findById(order.productId);
    product.quantity++;
    await product.save();
    await User.findByIdAndUpdate(order.userId, { $pull: { orders: orderId } });
    order.cancelled = true;
    await order.save();
    req.session.success = 'Order canceled';
    res.redirect('/admin/order');
}))

router.post('/order/deliver', isAdmin, catchAsyncErrors(async(req, res, next) => {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    order.delivered = true;
    await order.save();
    req.session.success = 'Order Delivered';
    res.redirect('/admin/order');
}))


router.get('/', isAdmin, catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;

    data.loggedIn = true;
    data.userName = req.session.userName;
    res.render('adminHome', data);
}))
module.exports = router;