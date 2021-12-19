const { ENVIRONMENT } = require("../config");

module.exports = (err, req, res, next) => {
    if (ENVIRONMENT == "development") console.log(err);
    err.message = err.message || "Internal Server Error";
    req.session.error = err.message;
    res.redirect(err.destination);
};