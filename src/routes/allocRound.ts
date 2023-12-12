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
import {
  validateAllocRoundCopyPost,
  validateAllocRoundPost,
  validateAllocRoundPut,
} from '../validationHandler/allocRound.js';
import {
  timeFormatString,
  timestampFormatString,
  validate,
  validateIdObl,
} from '../validationHandler/index.js';

const allocround = express.Router();

/* Get all allocations */
allocround.get(
  '/',
  [authenticator, admin, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('AllocRound')
      .select(
        'id',
        db_knex.raw(`DATE_FORMAT(date,"${timestampFormatString}") as "date"`),
        'name',
        'isSeasonAlloc',
        'userId',
        'description',
        db_knex.raw(
          `DATE_FORMAT(lastModified,"${timestampFormatString}") as "lastModified"`,
        ),
        'isAllocated',
        'processOn',
        'abortProcess',
        'requireReset',
      )
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

/* Get alloc round by id */
allocround.get(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: Request, res: Response) => {
    db_knex('AllocRound')
      .select(
        'id',
        db_knex.raw(`DATE_FORMAT(date,"${timestampFormatString}") as "date"`),
        'name',
        'isSeasonAlloc',
        'userId',
        'description',
        db_knex.raw(
          `DATE_FORMAT(lastModified,"${timestampFormatString}") as "lastModified"`,
        ),
        'isAllocated',
        'processOn',
        'abortProcess',
        'requireReset',
      )
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the buildings from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Building');
      });
  },
);

// Adding an AllocRound
const userId = 201; // user id for adding new AllocRound

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

allocround.post(
  '/copyAllocRound',
  validateAllocRoundCopyPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    const copiedAllocRoundId = req.body.copiedAllocRoundId;
    const allocRound = {
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
    };
    db_knex('AllocRound')
      .select()
      .where('id', copiedAllocRoundId)
      .then((data) => {
        if (data.length === 1) {
          successHandler(
            req,
            res,
            [10999],
            'Adding the new alloc round based on existing was succesful.',
          );
        } else {
          requestErrorHandler(
            req,
            res,
            `Existing AllocRound id was wrong: ${copiedAllocRoundId}`,
          );
        }
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
      .update(allocRound)
      .where('id', req.body.id)
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
