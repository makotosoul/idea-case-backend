const express = require("express");
const equipment = express.Router();
const db = require("../db/index");
//const logger = require("../utils/logger");??
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

// Equipment id:s and name:s, for a select list and for the default priority
equipment.get("/getEquipData", (req, res) => {
  const sqlSelectName =
    "SELECT id, name, priority AS equipmentPriority FROM Equipment";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Equipment");
    } else {
      successHandler(res, result, "getNames successful - Equipment");
    }
  });
});

module.exports = equipment;
