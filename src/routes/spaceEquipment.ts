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
import { validate } from '../validationHandler/index.js';
import { validateSpaceId } from '../validationHandler/space.js';

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

export default spaceequipment;
