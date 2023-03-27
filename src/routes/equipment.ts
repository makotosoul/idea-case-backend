import express from 'express';
import db_knex from '../db/index_knex.js';
import logger from '../utils/logger.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validateAddEquipment } from '../validationHandler/index.js';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';

const equipment = express.Router();

// Equipment id:s and name:s, for a select list and for the default priority done with Knex
equipment.get('/', (req, res) => {
  db_knex('Equipment')
    .select('id', 'name', 'priority as equipmentPriority', 'description')
    .then((data) => {
      successHandler(res, data, 'getNames succesful - Equipment');
    })
    .catch((err) => {
      requestErrorHandler(res, `${err}Oops! Nothing came through - Equipment`);
    });
});

equipment.post('/', validateAddEquipment, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationErrorHandler(res, 'Formatting problem');
  }

  db_knex
    .insert(req.body)
    .into('Equipment')
    .then((idArray) => {
      successHandler(res, idArray, 'Adding an equipment was succesful.');
    })
    .catch((error) => {
      if (error.errno === 1062) {
        requestErrorHandler(
          res,
          `Equipment with the ${req.body.id} already exists!`,
        );
      } else if (error.errno === 1052) {
        dbErrorHandler(res, error, 'Error in database column name');
      } else {
        dbErrorHandler(res, error, 'Error at adding equipment');
      }
    });
});

equipment.delete('/:id', (req, res) => {
  db_knex('Equipment')
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
      dbErrorHandler(res, error, 'Error at equipment delete');
    });
});

equipment.put('/updateEquip', (req, res) => {
  db_knex('Equipment')
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
      dbErrorHandler(res, error, 'Error at updating equipment');
    });
});

export default equipment;
