const express = require("express");
const equipment = express.Router();
const db = require("../db/index");
const logger = require("../utils/logger");
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

// Varusteiden nimet ja id, selectiin
equipment.get("/getNames", (req, res) => {
  const sqlSelectName = "SELECT id, name FROM Equipment";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Equipment");
    } else {
      successHandler(res, result, "getNames successful - Equipment");
    }
  });
});

module.exports = equipment;
