const axios = require("axios");

const dailyClient = axios.create({
  baseURL: process.env.DAILY_API,
  headers: {
    Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
  },
});

module.exports = { dailyClient };
