const { isLoginedUser, isAuthenticatedUser } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
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
    console.log(data);
    res.render('cart', data);
}))

router.post('/cart', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.userId;
    await User.findByIdAndUpdate(userId, { $push: { cart: productId } });
    req.session.success = 'Product added to cart';
    res.redirect('/user/cart');
}));

router.get('/cart/delete/:productId', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const productId = req.params.productId;
    console.log(productId);
    const userId = req.session.userId;
    await User.findByIdAndUpdate(userId, { $pull: { cart: productId } });
    req.session.success = 'Product removed from cart';
    res.redirect('/user/cart');
}));

module.exports = router;