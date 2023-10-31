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
import { validate } from '../validationHandler/index.js';
import { validateSubjectId } from '../validationHandler/subject.js';
import { validateSubjectEquipmentPostAndPut } from '../validationHandler/subjectEquipment.js';

const subjectequipment = express.Router();

// Getting all equipment requirement rows for a subject based on the subject id
/* subjectequipment.get('/getEquipment/:subjectId', (req, res) => {
  const subjectId = req.params.subjectId;
  const sqlGetEquipmentBySubjectId =
    'SELECT se.subjectId , e.name,e.description, se.equipmentId, se.priority, se.obligatory FROM SubjectEquipment se JOIN Equipment e ON se.equipmentId = e.id WHERE se.subjectid = ?;';
  db.query(sqlGetEquipmentBySubjectId, subjectId, (err, result) => {
    if (err) {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Nothing came through - SubjectEquipment',
      );
    } else {
      successHandler(
        req,
        res,
        result,
        'getEquipment successful - SubjectEquipment',
      );
    }
  });
}); */

// Adding a equipment requirement to teaching/subject
/* subjectequipment.post(
  '/post',
  validateSubjectEquipmentPostAndPut,
  (req: Request, res: Response) => {
 
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;
    const sqlInsert =
      'INSERT INTO SubjectEquipment (subjectId, equipmentId, priority, obligatory) VALUES (?,?,?,?)';
    db.query(
      sqlInsert,
      [subjectId, equipmentId, priority, obligatory],
      (err, result) => {
        if (!result) {
          requestErrorHandler(req, res, `${err}: Nothing to insert`);
        } else if (err) {
          dbErrorHandler(
            req,
            res,
            err,
            'Oops! Create failed - SubjectEquipment',
          );
        } else {
          successHandler(
            req,
            res,
            { insertId: result.insertId },
            'Create successful - SubjectEquipment',
          );
          logger.info(
            `SubjectEquipment created subjectId ${req.body.subjectId} &
              ${req.body.equipmentId}`,
          );
        }
      },
    );
  },
); */

// Modifying the equipment required by the subject/teaching
subjectequipment.put(
  '/update',
  [validate],
  validateSubjectEquipmentPostAndPut,
  (req: Request, res: Response) => {
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const sqlUpdate =
      ' UPDATE SubjectEquipment SET priority = ?, obligatory = ? WHERE subjectId = ? AND equipmentId = ?;';
    db.query(
      sqlUpdate,
      [priority, obligatory, subjectId, equipmentId],
      (err, result) => {
        if (!result) {
          requestErrorHandler(req, res, `${err}: Nothing to update`);
        } else if (err) {
          dbErrorHandler(
            req,
            res,
            err,
            'Oops! Update failed - SubjectEquipment',
          );
        } else {
          successHandler(
            req,
            res,
            result,
            'Update successful - SubjectEquipment',
          );
          logger.info('SubjectEquipment ', req.body.subjectId, ' updated');
        }
      },
    );
  },
);

// Removing an equipment requirement from a subject
subjectequipment.delete('/delete/:subjectId/:equipmentId', (req, res) => {
  const subjectId = req.params.subjectId;
  const equipmentId = req.params.equipmentId;
  const sqlDelete =
    'DELETE FROM SubjectEquipment WHERE subjectId = ? AND equipmentId = ?;';
  db.query(sqlDelete, [subjectId, equipmentId], (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Delete failed - SubjectEquipment');
    } else {
      successHandler(req, res, result, 'Delete successful - SubjectEquipment');
      logger.info('SubjectEquipment deleted');
    }
  });
});

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
  validateSubjectEquipmentPostAndPut,
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

export default subjectequipment;
