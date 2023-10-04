import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validate } from '../validationHandler/index.js';

const space = express.Router();

// Get space type id:s and name:s, for populating a select list
// spaceType.get('/getSelectData', (req, res) => {
//   const sqlSelectName = 'SELECT id, name FROM SpaceType';
//   db.query(sqlSelectName, (err, result) => {
//     if (err) {
//       dbErrorHandler(req, res, err, 'Oops! Nothing came through - SpaceType');
//     } else {
//       successHandler(req, res, result, 'getNames successful - SpaceType');
//     }
//   });
// });

// get all spaces
space.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Space')
      .select('id', 'name', 'area')
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'All Spaces fetched succesfully from DB.',
        );
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `${err}Oops! Nothing came through - Space`,
        );
      });
  },
);

// Adding a space
space.post(
  '/',
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const spaceData = {
      name: req.body.name,
      area: req.body.area,
      info: req.body.info,
      personLimit: req.body.personLimit,
      buildingId: req.body.buildingId,
      availableFrom: req.body.availableFrom,
      availableTo: req.body.availableTo,
      classesFrom: req.body.classesFrom,
      classesTo: req.body.classesTo,
      inUse: req.body.inUse || true, // Default to true if not provided
      spaceTypeId: req.body.spaceTypeId,
    };

    db_knex('Space')
      .insert(spaceData)
      .then((result) => {
        if (result.length === 0) {
          requestErrorHandler(req, res, 'Nothing to insert');
        } else {
          successHandler(
            req,
            res,
            { insertId: result[0] }, // Assuming auto-incremented ID
            'Space created successfully.',
          );
        }
      })
      .catch((error) => {
        requestErrorHandler(
          req,
          res,
          `Oops! Create failed - Space: ${error.message}`,
        );
      });
  },
);

// delete space by id
space.delete(
  '/:id',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('Space')
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
          requestErrorHandler(req, res, `Invalid space ID: ${req.params.id}`);
        }
      })
      .catch((error) => {
        requestErrorHandler(req, res, `Error deleting space: ${error.message}`);
      });
  },
);

export default space;
