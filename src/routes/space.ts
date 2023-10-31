import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db from '../db/index.js';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import logger from '../utils/logger.js';
import { validate, validateId } from '../validationHandler/index.js';

const space = express.Router();

// Get all spaces
space.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .select(
        's.id',
        's.name',
        's.area',
        's.info',
        's.personLimit',
        's.buildingId',
        's.availableFrom',
        's.availableTo',
        's.classesFrom',
        's.classesTo',
        's.inUse',
        's.spaceTypeId',
        'b.name AS buildingName',
        'st.name AS spaceTypeName',
      )
      .from('Space as s')
      .innerJoin('Building as b', 's.buildingId', 'b.id')
      .leftJoin('SpaceType as st', 's.spaceTypeId', 'st.id')
      .then((spaces) => {
        successHandler(req, res, spaces, 'getAll successful - Space');
      })
      .catch((err) => {
        requestErrorHandler(
          req,
          res,
          `Oops! Nothing came through - Space: ${err.message}`,
        );
      });
  },
);

// SPECIAL Listing all the spaces for selection dropdown etc.
// (Just name and id) using knex
space.get(
  '/getNames',
  [authenticator, admin, roleChecker],
  (req: Request, res: Response) => {
    db_knex
      .select('id', 'name')
      .from('Space')
      .then((spaceNames) => {
        successHandler(req, res, spaceNames, 'getNames successful - Space');
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Nothing came through - Space');
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

// Delete space by id
/*
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
);*/

space.delete(
  '/:id',
  validateId,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const id = req.params.id;
    const sqlDelete = 'DELETE FROM Space WHERE id = ?;';
    db.query(sqlDelete, id, (err, result) => {
      if (err) {
        dbErrorHandler(req, res, err, 'Oops! Delete failed - Space');
      } else {
        successHandler(req, res, result, 'Delete successful - Space');
        logger.info('Space deleted');
      }
    });
  },
);

// Update space by ID
space.put(
  '/:id',
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const spaceId = req.params.id;
    const updatedSpaceData = {
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
      .where('id', spaceId)
      .update(updatedSpaceData)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            `Update successful! Count of modified rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(req, res, `Invalid space ID: ${spaceId}`);
        }
      })
      .catch((error) => {
        requestErrorHandler(req, res, `Error updating space: ${error.message}`);
      });
  },
);

export default space;
