const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Tähän oma password jos on muutoin tyhjäks ""
  database: "", // Tähän oma tietokannan nimi
});

module.exports = db;
