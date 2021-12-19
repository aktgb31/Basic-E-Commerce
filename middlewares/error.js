module.exports = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    req.session.error = err.message;
    res.redirect(err.destination);
};