import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validateAddUpdateDepartment } from '../validationHandler/index.js';
import { validationResult } from 'express-validator';

const department = express.Router();

department.get('/getDeptData', (req, res) => {
  db_knex('Department')
    .select('id', 'name', 'description')
    .then((data) => {
      successHandler(res, data, 'GetDeptData succesful -Department');
    })
    .catch((err) => {
      requestErrorHandler(
        res,
        `${err} Oops! Nothing came through - Department`,
      );
    });
});

department.post('/', validateAddUpdateDepartment, (req: any, res: any) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    return validationErrorHandler(
      res,
      `${valResult}validateAddUpdateDepartment error`,
    );
  }

  db_knex('Department')
    .insert(req.body)
    .into('Department')
    .then((idArray) => {
      successHandler(
        res,
        idArray,
        'Adding a department, or multiple departments was succesful',
      );
    })
    .catch((error) => {
      if (error.errno === 1062) {
        requestErrorHandler(
          res,
          `Conflict: Department with the name ${req.body.name} already exists!`,
        );
      } else if (error.errno === 1054) {
        requestErrorHandler(
          res,
          "error in spelling [either in 'name' and/or in 'description'].",
        );
      } else {
        dbErrorHandler(res, error, 'error adding department');
      }
    });
});

department.delete('/:id', (req, res) => {
  db_knex('Department')
    .where('id', req.params.id)
    .del()
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(
          res,
          rowsAffected,
          `Delete succesful! Count of deleted rows: ${rowsAffected}`,
        );
      } else {
        requestErrorHandler(res, `Invalid number id: ${req.params.id}`);
      }
    })
    .catch((error) => {
      dbErrorHandler(res, error, 'Error');
    });
});

department.put('/updateDept', (req, res) => {
  db_knex('Department')
    .where('id', req.body.id)
    .update(req.body)
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(res, rowsAffected, 'Updated succesfully');
      } else {
        requestErrorHandler(res, 'Error');
      }
    })
    .catch((error) => {
      dbErrorHandler(res, error, 'Error at updating department');
    });
});

export default department;
