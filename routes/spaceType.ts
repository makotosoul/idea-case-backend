import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  successHandler,
  requestErrorHandler,
} from '../responseHandler/index.js';

const spaceType = express.Router();

// Get space type id:s and name:s, for populating a select list
// spaceType.get("/getSelectData", (req, res) => {
//   const sqlSelectName = "SELECT id, name FROM SpaceType";
//   db.query(sqlSelectName, (err, result) => {
//     if (err) {
//       dbErrorHandler(res, err, "Oops! Nothing came through - SpaceType");
//     } else {
//       successHandler(res, result, "getNames successful - SpaceType");
//     }
//   });
// });

spaceType.get('/getSelectData', (req, res) => {
  db_knex('SpaceType')
    .select('id', 'name', 'description')
    .then((data) => {
      successHandler(
        res,
        JSON.stringify(data),
        'All SpaceTypes fetched succesfully from DB.',
      );
    })
    .catch((err) => {
      requestErrorHandler(res, `${err}Oops! Nothing came through - SpaceType`);
    });
});

export default spaceType;
