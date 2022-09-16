const express = require("express");
const program = express.Router();
const db = require("../db/index");
const logger = require("../utils/logger");

// Pääaineitten nimet ja id, selectiin
program.get("/getNames", (req, res) => {
  const sqlSelectName = "SELECT id, name FROM Program";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      logger.error("Oops! Nothing came through - Program.");
      res.status(500).send("kkk");
    } else {
      logger.http("getNames succsesfull- Program");
      res.send(result);
    }
  });
});

module.exports = program;
