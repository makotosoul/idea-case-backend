import express from 'express';
const spaceType = express.Router();
import db from '../db/index.js';
//import logger from '../utils/logger.js';??
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

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
