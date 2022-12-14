const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({});

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "casedb",
});
module.exports = db;
