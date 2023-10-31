import express, { Request, Response } from 'express';
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
} from '../responseHandler/index.js';
import { validateEquipmentPost } from '../validationHandler/equipment.js';
import { validate } from '../validationHandler/index.js';

const equipment = express.Router();

// Equipment id:s and name:s,
// for a select list and for the default priority done with Knex
equipment.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .select('id', 'name', 'priority as equipmentPriority', 'description')
      .then((data) => {
        successHandler(req, res, data, 'getNames successful - Equipment');
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err} Oops! Nothing came through - Equipment`,
        );
      });
  },
);

// get equipment by id
equipment.get(
  '/:id',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the equipment from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Equipment');
      });
  },
);

// adding an equipment
equipment.post(
  '/',
  validateEquipmentPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .insert(req.body)
      .into('Equipment')
      .then((idArray) => {
        successHandler(req, res, idArray, 'Adding an equipment was succesful.');
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Equipment with the ${req.body.id} already exists!`,
          );
        } else if (error.errno === 1052) {
          dbErrorHandler(req, res, error, 'Error in database column name');
        } else {
          dbErrorHandler(req, res, error, 'Error at adding equipment');
        }
      });
  },
);

// updating an equipment
equipment.put(
  '/:id',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
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
        dbErrorHandler(req, res, error, 'Error at updating equipment');
      });
  },
);

// deleting an equipment
equipment.delete(
  '/:id',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Equipment')
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete successful! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid number id: ${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error at equipment delete');
      });
  },
);

export default equipment;
