const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Product = require('../models/product');

const router = require('express').Router();

router.get('/', catchAsyncErrors(async(req, res, next) => {
    const data = {};
    data.success = req.session.success;
    data.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    if (req.session.userId)
        data.userName = req.session.userName;
    else
        data.userName = 'User';
    let products = await Product.find({});
    products = products.map(product => {
        if (product.quantity > 0) product.inStock = true;
        else product.outOfStock = true;
        return product;
    });
    data.products = []
    while (products.length) data.products.push(products.splice(0, 3));
    res.render('home', data);
}))

module.exports = router;