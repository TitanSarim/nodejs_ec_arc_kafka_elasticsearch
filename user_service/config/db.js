const { query } = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database.");
});

pool.on("error", (err, client) => {
  console.error("Error connecting to PostgreSQL database:", err.stack);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
