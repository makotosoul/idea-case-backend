import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import {
  validate,
  validateAddUpdateDepartment,
} from '../validationHandler/index.js';

const department = express.Router();

// get all departments
department.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker],
  (req: Request, res: Response) => {
    db_knex('Department')
      .select('id', 'name', 'description')
      .then((data) => {
        successHandler(req, res, data, 'GetDeptData succesful -Department');
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err} Oops! Nothing came through - Department`,
        );
      });
  },
);

// get department by id
department.get(
  '/:id',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Department')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the department by id from database',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oh no! could not get anything from database',
        );
      });
  },
);

// add department
department.post(
  '/',
  [authenticator, admin, roleChecker, validate],
  validateAddUpdateDepartment,
  (req: Request, res: Response) => {
    db_knex('Department')
      .insert(req.body)
      .into('Department')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a department, or multiple departments was succesful',
        );
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Conflict: Department with the name ${req.body.name} already exists!`,
          );
        } else if (error.errno === 1054) {
          requestErrorHandler(
            req,
            res,
            "error in spelling [either in 'name' and/or in 'description'].",
          );
        } else {
          dbErrorHandler(req, res, error, 'error adding department');
        }
      });
  },
);

// update department
department.put(
  '/',
  [authenticator, admin, roleChecker],
  (req: Request, res: Response) => {
    db_knex('Department')
      .where('id', req.body.id)
      .update(req.body)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(req, res, rowsAffected, 'Updated succesfully');
        } else {
          requestErrorHandler(req, res, 'Error');
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error at updating department');
      });
  },
);

// delete department by id
department.delete(
  '/:id',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Department')
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete succesful! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid number id: ${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error');
      });
  },
);

export default department;
