const dotenv = require("dotenv");
const envFound = dotenv.config();
if (envFound.error) {
    throw new Error("Couldn't find env file");
}

module.exports = {
    ADMIN: { EMAIL: process.env.ADMIN_EMAIL, PASSWORD: process.env.ADMIN_PASSWORD },
};