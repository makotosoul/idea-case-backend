import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validate } from '../validationHandler/index.js';

const space = express.Router();

// Get space type id:s and name:s, for populating a select list
// spaceType.get('/getSelectData', (req, res) => {
//   const sqlSelectName = 'SELECT id, name FROM SpaceType';
//   db.query(sqlSelectName, (err, result) => {
//     if (err) {
//       dbErrorHandler(req, res, err, 'Oops! Nothing came through - SpaceType');
//     } else {
//       successHandler(req, res, result, 'getNames successful - SpaceType');
//     }
//   });
// });

// get all spaces
space.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Space')
      .select('id', 'name', 'area')
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'All Spaces fetched succesfully from DB.',
        );
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err}Oops! Nothing came through - Space`,
        );
      });
  },
);

export default space;
