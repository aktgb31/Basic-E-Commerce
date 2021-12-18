class ErrorHandler extends Error {
    constructor(message, destination) {
        super(message);
        this.destination = destination
        Error.captureStackTrace(this, this.constructor);
    }

}
module.exports = ErrorHandler;