import express from 'express';
import db from '../db/index.js';

import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

const equipment = express.Router();

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

export default equipment;
