import express from 'express';
import db from '../db/index.js';
import db_knex from '../db/index_knex.js';
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

spaceType.get("/", (req, res) => {
  db_knex("SpaceType").select()
  .then((data) => {
    successHandler(res, data, "All SpaceTypes fetched succesfully from DB.");
  })
  .catch((error) => {
    dbErrorHandler(res, error, "Db error while fetching all SpaceTypes.")
  });
});

export default spaceType;
