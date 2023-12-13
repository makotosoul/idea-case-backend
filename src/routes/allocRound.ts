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
import logger from '../utils/logger.js';
import {
  validateAllocRoundCopyPost,
  validateAllocRoundPost,
  validateAllocRoundPut,
} from '../validationHandler/allocRound.js';
import {
  //timeFormatString,
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
  (req: Request, resp: Response) => {
    const copiedAllocRoundId = Number(req.body.copiedAllocRoundId);
    const allocRound = {
      name: req.body.name,
      description: req.body.description,
      userId: Number(req.body.userId),
    };

    /*
      CREATE OR REPLACE PROCEDURE copyAllocRound(allocRid1 INT, 
                                        allocRoundName2 VARCHAR(255), 
                                        allocRoundDescription2 VARCHAR(10000),
                                        creatorUserId2 INT)
    */

    db_knex
      .transaction((trx) => {
           return db_knex
          .raw('Call copyAllocRound(?,?,?,?,@outmsg)', 
            [copiedAllocRoundId,
            allocRound.name,
            allocRound.description,
            allocRound.userId]
          )
          .then(res => {
            logger.debug(`dbResp 1: ${res}`);
            return db_knex.select(db_knex.raw('@outmsg'));
          })
      })
      .then((res: any|undefined) => {
        logger.debug(`Got output dbResp 2: ${res} `);
        logger.debug(`res[0]['@outmsg']: ${res[0]['@outmsg']} `);
        if(res !== undefined && res !== null) {
          if(typeof(res)==="object" && res?.length===1) {
          successHandler(
            req,
            resp,
            res[0]['@outmsg'],     // was before [0][0][0]['@allocRid2 := last_insert_id()']
            'Adding the new alloc round based on existing was succesful 1.',
          );
          }
          else {
            requestErrorHandler(
              req,
              resp,
              `Something (1) went wrong when trying to create alloc round ${req.body.name} as copy of alloc round ${req.body.allocRid1}`,
            );
          }
        } else {
          requestErrorHandler(
            req,
            resp,
            `Something (2) went wrong when trying to create alloc round ${req.body.name} as copy of alloc round ${req.body.allocRid1}`,
          );
        }
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            resp,
            `Conflict: (3) AllocRound with the name ${req.body.name} already exists 2!`,
          );
        } else if (error.errno === 1052) {
          dbErrorHandler(req, resp, error, 'Error (4) in database column name');
        } else {
          dbErrorHandler(req, resp, error, 'Error (5) at adding alloc round');
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
