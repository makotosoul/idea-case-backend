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

/*
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config({});

export const databaseConfigObject = {
  client: process.env.DB_DRIVER_MODULE || 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'casedb', 
    debug: process.env.DB_DEBUG || false,
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS || true,
  },
  pool: {
    min: Number(process.env.DB_CONNECTION_POOL_MIN) || 0,
    max: Number(process.env.DB_CONNECTION_POOL_MAX) || 7,
  }
}

console.log("DB user: " +databaseConfigObject.connection.user);

// initiate knex with config
export default knex(databaseConfigObject);
*/
