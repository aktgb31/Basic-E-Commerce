const dotenv = require("dotenv");
const envFound = dotenv.config();
if (envFound.error) {
    throw new Error("Couldn't find env file");
}

module.exports = {
    ENVIRONMENT: process.env.NODE_ENV,
    ADMIN: { EMAIL: process.env.ADMIN_EMAIL, PASSWORD: process.env.ADMIN_PASSWORD },
};