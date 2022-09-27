const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Siba22", // Tähän oma password jos on muutoin tyhjäks ""
  database: "req_sub_schema", // Tähän oma tietokannan nimi
});

module.exports = db;
