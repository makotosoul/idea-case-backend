import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';

const department = express.Router();

department.get('/getDeptData', (req, res) => {
  db_knex('Department')
    .select('id', 'name', 'description')
    .then((data) => {
      successHandler(
        res,
        JSON.stringify(data),
        'GetDeptData succesful -Department',
      );
    })
    .catch((err) => {
      requestErrorHandler(
        res,
        `${err} Oops! Nothing came through - Department`,
      );
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
          JSON.stringify(rowsAffected),
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

export default department;
