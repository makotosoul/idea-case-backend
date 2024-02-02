import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db from '../db/index.js';
// knex available for new database operations
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import logger from '../utils/logger.js';
import { validate, validateIdObl } from '../validationHandler/index.js';
import { validateSubjectId } from '../validationHandler/subject.js';
import {
  validateSubjectAndEquipmentId,
  validateSubjectEquipmentPost,
} from '../validationHandler/subjectEquipment.js';

const subjectequipment = express.Router();

// Getting all equipment requirement rows for a subject based on the subject id using knex
subjectequipment.get(
  '/getEquipment/:subjectId',
  validateSubjectId,
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const subjectId = req.params.subjectId;
    db_knex
      .select(
        'se.subjectId',
        'e.name',
        'e.description',
        'se.equipmentId',
        'se.priority',
        'se.obligatory',
      )
      .from('SubjectEquipment as se')
      .innerJoin('Equipment as e', 'se.equipmentId', 'e.id')
      .where('se.subjectId', subjectId)
      .then((result) => {
        successHandler(
          req,
          res,
          result,
          'getEquipment successful - SubjectEquipment',
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Nothing came through - SubjectEquipment',
        );
      });
  },
);

// Adding a equipment requirement to teaching/subject using knex
subjectequipment.post(
  '/post',
  validateSubjectEquipmentPost,
  (req: Request, res: Response) => {
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;

    const subjectEquipmentData = {
      subjectId,
      equipmentId,
      priority,
      obligatory,
    };

    db_knex('SubjectEquipment')
      .insert(subjectEquipmentData)
      .returning('id') // Return the inserted ID
      .then((result) => {
        const insertId = result[0];
        successHandler(
          req,
          res,
          { insertId },
          'Create successful - SubjectEquipment',
        );
        logger.info(
          `SubjectEquipment created subjectId ${subjectId} & ${equipmentId}`,
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Create failed - SubjectEquipment',
        );
      });
  },
);

// Modifying the equipment required by the subject/teaching with knex
subjectequipment.put(
  '/update',
  validateSubjectEquipmentPost,
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex('SubjectEquipment')
      .update(req.body)
      .where('subjectId', req.body.subjectId)
      .andWhere('equipmentId', req.body.equipmentId)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(req, res, rowsAffected, 'Updated succesfully');
        } else {
          requestErrorHandler(req, res, 'Error');
        }
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Error while updating SubjectEquipment',
        );
      });
  },
);

// Removing an equipment requirement from a subject with knex
subjectequipment.delete(
  '/delete/:subjectId/:equipmentId',
  validateSubjectAndEquipmentId,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const subjectId = req.params.subjectId;
    const equipmentId = req.params.equipmentId;
    db_knex('SubjectEquipment')
      .del()
      .where('subjectId', subjectId)
      .andWhere('equipmentId', equipmentId)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            req,
            res,
            rowsAffected,
            'Delete successful - SubjectEquipment',
          );
        } else {
          requestErrorHandler(req, res, 'Nothing to delete');
        }
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Delete failed - SubjectEquipment',
        );
      });
  },
);

export default subjectequipment;
