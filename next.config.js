require('dotenv').config();

exports.default = {
  env: {
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL
  }
};