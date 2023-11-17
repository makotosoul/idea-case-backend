import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db from '../db/index.js';
// knex available for new database operations
import db_knex from '../db/index_knex.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';
import logger from '../utils/logger.js';
import { validate } from '../validationHandler/index.js';
import { validateSpaceId } from '../validationHandler/space.js';
import { validateSpaceEquipmentPost } from '../validationHandler/spaceEquipment.js';

const spaceequipment = express.Router();

// Getting all equipment requirement rows for a space based on the space id using knex
spaceequipment.get(
  '/getEquipment/:spaceId',
  validateSpaceId, // Add a validation for spaceId
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const spaceId = req.params.spaceId;
    db_knex
      .select('se.spaceId', 'e.name', 'e.description', 'se.equipmentId')
      .from('SpaceEquipment as se')
      .innerJoin('Equipment as e', 'se.equipmentId', 'e.id')
      .where('se.spaceId', spaceId)
      .then((result) => {
        successHandler(
          req,
          res,
          result,
          'getEquipment successful - SpaceEquipment',
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Nothing came through - SpaceEquipment',
        );
      });
  },
);

// Adding a space equipment requirement using knex
spaceequipment.post(
  '/post',
  validateSpaceEquipmentPost, // You need to create this validation middleware
  (req: Request, res: Response) => {
    const spaceId = req.body.spaceId;
    const equipmentId = req.body.equipmentId;

    const spaceEquipmentData = {
      spaceId,
      equipmentId,
    };

    db_knex('SpaceEquipment')
      .insert(spaceEquipmentData)
      .returning('id') // Return the inserted ID
      .then((result) => {
        const insertId = result[0];
        successHandler(
          req,
          res,
          { insertId },
          `Create successful - SpaceEquipment created spaceId ${spaceId} & ${equipmentId}`,
        );
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Create failed - SpaceEquipment');
      });
  },
);

// Removing an equipment from a space
spaceequipment.delete('/delete/:spaceId/:equipmentId', (req, res) => {
  const spaceId = req.params.spaceId;
  const equipmentId = req.params.equipmentId;
  const sqlDelete =
    'DELETE FROM SpaceEquipment WHERE spaceId = ? AND equipmentId = ?;';
  db.query(sqlDelete, [spaceId, equipmentId], (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Delete failed - SpaceEquipment');
    } else {
      successHandler(req, res, result, 'Delete successful - SpaceEquipment');
    }
  });
});

export default spaceequipment;
