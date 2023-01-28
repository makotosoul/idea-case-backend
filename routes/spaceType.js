const express = require("express");
const spaceType = express.Router();
const db = require("../db/index");
//const logger = require("../utils/logger");??
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

// Get space type id:s and name:s, for populating a select list
spaceType.get("/getSelectData", (req, res) => {
  const sqlSelectName = "SELECT id, name FROM SpaceType";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - SpaceType");
    } else {
      successHandler(res, result, "getNames successful - SpaceType");
    }
  });
});

module.exports = spaceType;
