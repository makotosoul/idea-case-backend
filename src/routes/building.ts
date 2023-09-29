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
  validateBuildingMultiPost,
  validateBuildingPost,
} from '../validationHandler/index.js';

const building = express.Router();

function handleErrorBasedOnErrno(
  req: Request,
  res: Response,
  error: any,
  defaultMessage: string,
) {
  switch (error.errno) {
    case 1062:
      requestErrorHandler(
        req,
        res,
        `Conflict: Building with the name ${req.body.name} already exists!`,
      );
      break;
    case 1054:
      requestErrorHandler(
        req,
        res,
        "error in spelling [either in 'name' and/or in 'description'].",
      );
      break;
    default:
      dbErrorHandler(req, res, error, defaultMessage);
      break;
  }
}

// get all buildings
building.get(
  '/',
  [authenticator, admin, statist, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Building')
      .select()
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the buildings from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Error trying to read all buildings from DB',
        );
      });
  },
);

// get building by id
building.get(
  '/:id',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Building')
      .select()
      .where('id', req.params.id)
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Successfully read the building from DB',
        );
      })
      .catch((err) => {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Building');
      });
  },
);

// adding single building
building.post(
  '/',
  [authenticator, admin, roleChecker, validate],
  validateBuildingPost,
  (req: Request, res: Response) => {
    const valResult = validationResult(req);

    if (!valResult.isEmpty()) {
      return validationErrorHandler(
        req,
        res,
        `${valResult}validateAddUpdateBuilding error`,
      );
    }
    db_knex('Building')
      .insert(req.body)
      .into('Building')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a building, or multiple buildings was succesful',
        );
      })
      .catch((error) => {
        handleErrorBasedOnErrno(req, res, error, 'error adding building');
      });
  },
);

// adding single or multiple building
building.post(
  '/multi',
  [authenticator, admin, roleChecker, validate],
  validateBuildingMultiPost,
  (req: Request, res: Response) => {
    const valResult = validationResult(req);

    if (!valResult.isEmpty()) {
      validationErrorHandler(
        req,
        res,
        `${valResult} validateAddBuildings error`,
      );

      return;
    }

    db_knex('Building')
      .insert(req.body)
      .into('Building')
      .then((idArray) => {
        successHandler(
          req,
          res,
          idArray,
          'Adding a building, or multiple buildings was succesful',
        );
      })
      .catch((error) => {
        handleErrorBasedOnErrno(req, res, error, 'error adding building');
      });
  },
);

// updating building information
building.put(
  '/',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    if (!req.body.name) {
      requestErrorHandler(req, res, 'Building name is missing.');
    } else {
      db_knex('Building')
        .where('id', req.body.id)
        .update(req.body)
        .then((rowsAffected) => {
          if (rowsAffected === 1) {
            successHandler(
              req,
              res,
              rowsAffected,
              `Update building successful! Count of modified rows: ${rowsAffected}`,
            );
          } else {
            requestErrorHandler(
              req,
              res,
              `Update building not successful, ${rowsAffected} row modified`,
            );
          }
        })
        .catch((error) => {
          handleErrorBasedOnErrno(req, res, error, 'error adding building');
        });
    }
  },
);

// delete building by id
building.delete(
  '/:id',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Building')
      .select()
      .where('id', req.params.id)
      .del()
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Delete succesfull! Count of deleted rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid building id:${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error delete failed');
      });
  },
);

export default building;
