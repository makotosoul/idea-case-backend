import express from 'express';
import db from '../db/index.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

const program = express.Router();

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

export default program;
