import express from 'express';
import db from '../db/index.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

const spaceType = express.Router();

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

export default spaceType;
