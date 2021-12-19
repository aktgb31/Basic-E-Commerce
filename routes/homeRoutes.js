const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Product = require('../models/product');
const User = require('../models/user');

const router = require('express').Router();

router.get('/', catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    data.loggedIn = false;
    if (req.session.userId) {
        data.loggedIn = true;
        data.userName = req.session.userName;
    } else
        data.userName = 'User';
    let products = await Product.find({});

    const user = await User.findById(req.session.userId);
    let userCart = [];
    if (user) userCart = user.cart;

    products = products.map(product => {
        if (product.quantity > 0) product.inStock = true;
        else product.outOfStock = true;
        if (userCart.find((bsonObjectId) => { return bsonObjectId.toString() == product._id; }))
            product.inCart = true;
        return product;
    });
    data.products = []
    while (products.length) data.products.push(products.splice(0, 3));
    res.render('home', data);
}))

module.exports = router;