import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db from '../db/index.js';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import logger from '../utils/logger.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import { validateProgramPost } from '../validationHandler/program.js';

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

// get program by id
program.get(
  '/:id',
  validateIdObl,
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

// get program by programName and email
program.get(
  '/programName/:email',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Program')
      .select('Program.name')
      .join(
        'DepartmentPlanner',
        'Program.departmentId',
        '=',
        'DepartmentPlanner.departmentId',
      )
      .join('User', 'DepartmentPlanner.userId', '=', 'User.id')
      .where('User.email', '=', req.params.email)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          `Succesfully read the program from DB with user email: ${req.params.email} `,
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Program');
      });
  },
);

// create program
// TODO: add validationHandler for validating program name and departmentId
program.post(
  '/',
  validateProgramPost,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const newProgram = {
      name: req.body.name,
      departmentId: req.body.departmentId,
    };

    db_knex('Program')
      .insert(newProgram)
      .then((result) => {
        if (result.length === 0) {
          requestErrorHandler(req, res, 'Nothing to insert');
        } else {
          successHandler(
            req,
            res,
            { id: result[0] }, // Assuming auto-incremented ID
            'Create successful - Program',
          );
          logger.info(`Program ${newProgram.name} created`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Create failed - Program');
      });
  },
);

export default program;
