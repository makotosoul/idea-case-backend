const express = require("express");
const program = express.Router();
const db = require("../db/index");
//const logger = require("../utils/logger");??
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

// Program id:s and name:s, to be used in a select list
program.get("/getSelectData", (req, res) => {
  const sqlSelectName = "SELECT id, name FROM Program";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Program");
    } else {
      successHandler(res, result, "getNames successful - Program");
    }
  });
});

module.exports = program;
