const express = require("express");
const spaceType = express.Router();
const db = require("../db/index");
const logger = require("../utils/logger");
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

// Huone tyyppien nimet ja id, selectiin
spaceType.get("/getNames", (req, res) => {
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
