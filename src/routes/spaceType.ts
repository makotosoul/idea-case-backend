import express, { Request, Response } from 'express';

import db_knex from '../db/index_knex.js';
import {
  successHandler,
  requestErrorHandler,
} from '../responseHandler/index.js';
import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { statist } from '../authorization/statist.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { validate } from '../validationHandler/index.js';

const spaceType = express.Router();

// Get space type id:s and name:s, for populating a select list
// spaceType.get("/getSelectData", (req, res) => {
//   const sqlSelectName = "SELECT id, name FROM SpaceType";
//   db.query(sqlSelectName, (err, result) => {
//     if (err) {
//       dbErrorHandler(req,res, err, "Oops! Nothing came through - SpaceType");
//     } else {
//       successHandler(req,res, result, "getNames successful - SpaceType");
//     }
//   });
// });

//get all spacetypes
spaceType.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SpaceType')
      .select('id', 'name', 'description')
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'All SpaceTypes fetched succesfully from DB.',
        );
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err}Oops! Nothing came through - SpaceType`,
        );
      });
  },
);

export default spaceType;
