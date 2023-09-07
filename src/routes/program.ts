import express from 'express';
import { Request, Response } from 'express';

import db from '../db/index.js';
import db_knex from '../db/index_knex.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';
import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { statist } from '../authorization/statist.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { validate } from '../validationHandler/index.js';

const program = express.Router();

// Program id:s and name:s, to be used in a select list
program.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const sqlSelectName = 'SELECT id, name FROM Program';
    db.query(sqlSelectName, (err, result) => {
      if (err) {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Program');
      } else {
        successHandler(req, res, result, 'getNames successful - Program');
      }
    });
  },
);

//get program by id
program.get(
  '/:id',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Program')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          `Succesfully read the program from DB with id: ${req.params.id} `,
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Program');
      });
  },
);

export default program;
