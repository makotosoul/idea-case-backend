import express from 'express';
import { Response, Request } from 'express';

import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
} from '../responseHandler/index.js';

import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { statist } from '../authorization/statist.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import {
  validateAllocRoundPost,
  validateAllocRoundPut,
} from '../validationHandler/allocRound.js';

const allocround = express.Router();

/* Get all allocations */
allocround.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('AllocRound')
      .select('id', 'name', 'isSeasonAlloc', 'description', 'lastModified')
      .then((data) => {
        successHandler(req, res, data, 'getAll succesful - Allocation');
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Nothing came through - Allocation getAll',
        );
      });
  },
);

// Adding an AllocRound
const userId = 201; //user id for adding new AllocRound

allocround.post(
  '/',
  validateAllocRoundPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    const allocRound = {
      name: req.body.name,
      description: req.body.description,
      userId: userId,
    };
    db_knex
      .insert(allocRound)
      .into('AllocRound')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding the new alloc round was succesful.',
        );
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Conflict: AllocRound with the name ${req.body.name} already exists!`,
          );
        } else if (error.errno === 1052) {
          dbErrorHandler(req, res, error, 'Error in database column name');
        } else {
          dbErrorHandler(req, res, error, 'Error at adding alloc round');
        }
      });
  },
);

// Delete allocround round
allocround.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('AllocRound')
      .select()
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
          requestErrorHandler(
            req,
            res,
            `Invalid AllocRound id:${req.params.id}`,
          );
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting alloc round failed');
      });
  },
);

// Update allocround round
allocround.put(
  '/',
  validateAllocRoundPut,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    const allocRound = {
      name: req.body.name,
      description: req.body.description,
    };

    db_knex('AllocRound')
      .where('id', req.body.id)
      .update(allocRound)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(req, res, rowsAffected, 'Updated succesfully');
        } else {
          requestErrorHandler(req, res, 'Error');
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error at updating AllocRound');
      });
  },
);

export default allocround;
