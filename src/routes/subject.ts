import express from 'express';
import db from '../db/index.js';
import logger from '../utils/logger.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validationResult } from 'express-validator'; //import { body,}???
import { validateAddUpdateSubject } from '../validationHandler/index.js';
import { Response, Request } from 'express';

const subject = express.Router();

// Fetching all subjects, joining to each subject the program, and needed spacetype
subject.get('/getAll', (req, res) => {
  const sqlSelectSubjectProgram =
    '  SELECT s.id, s.name AS subjectName, s.groupSize, s.groupCount, s.sessionLength, s.sessionCount, s.area, s.programId, p.name AS programName, s.spaceTypeId, st.name AS spaceTypeName FROM Subject s JOIN Program p ON s.programId = p.id LEFT JOIN SpaceType st ON s.spaceTypeId = st.id;';
  db.query(sqlSelectSubjectProgram, (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Subject');
    } else {
      successHandler(req, res, result, 'getAll successful - Subject');
    }
  });
});

// Listing all the subjects (name and id)
subject.get('/getNames', (req, res) => {
  const sqlSelectSubjectNames = 'SELECT id, name FROM Subject;';
  db.query(sqlSelectSubjectNames, (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Subject');
    } else {
      successHandler(req, res, result, 'getNames successful - Subject');
    }
  });
});

// Adding a subject/teaching
subject.post(
  '/post',
  validateAddUpdateSubject,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation error:  %O', errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(req, res, 'Formatting problem');
    }
    const name = req.body.name;
    const groupSize = req.body.groupSize;
    const groupCount = req.body.groupCount;
    const sessionLength = req.body.sessionLength;
    const sessionCount = req.body.sessionCount;
    const area = req.body.area;
    const programId = req.body.programId;
    const spaceTypeId = req.body.spaceTypeId;
    const sqlInsert =
      'INSERT INTO Subject (name, groupSize, groupCount, sessionLength, sessionCount, area, programId, spaceTypeId) VALUES (?,?,?,?,?,?,?,?)';
    db.query(
      sqlInsert,
      [
        name,
        groupSize,
        groupCount,
        sessionLength,
        sessionCount,
        area,
        programId,
        spaceTypeId,
      ],
      (err, result) => {
        if (!result) {
          requestErrorHandler(req, res, `${err}: Nothing to insert`);
        } else if (err) {
          dbErrorHandler(req, res, err, 'Oops! Create failed - Subject');
        } else {
          successHandler(
            req,
            res,
            { insertId: result.insertId },
            'Create successful - Subject',
          );
          logger.info(`Subject ${req.body.name} created`);
        }
      },
    );
  },
);

// Removing a subject/teaching
subject.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sqlDelete = 'DELETE FROM Subject WHERE id = ?;';
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Delete failed - Subject');
    } else {
      successHandler(req, res, result, 'Delete successful - Subject');
      logger.info('Subject deleted');
    }
  });
});

// Modifying the subject = teaching
subject.put(
  '/update',
  validateAddUpdateSubject,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation error:  %O', errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(req, res, 'Formatting problem');
    }
    const id = req.body.id;
    const name = req.body.name;
    const groupSize = req.body.groupSize;
    const groupCount = req.body.groupCount;
    const sessionLength = req.body.sessionLength;
    const sessionCount = req.body.sessionCount;
    const area = req.body.area;
    const programId = req.body.programId;
    const spaceTypeId = req.body.spaceTypeId;
    const sqlUpdate =
      'UPDATE Subject SET name = ?, groupSize = ?, groupCount = ?, sessionLength = ?, sessionCount = ?, area = ?,  programId = ?, spaceTypeId = ? WHERE id = ?';
    db.query(
      sqlUpdate,
      [
        name,
        groupSize,
        groupCount,
        sessionLength,
        sessionCount,
        area,
        programId,
        spaceTypeId,
        id,
      ],
      (err, result) => {
        if (!result) {
          requestErrorHandler(req, res, `${err}: Nothing to update`);
        } else if (err) {
          dbErrorHandler(req, res, err, 'Oops! Update failed - Subject');
        } else {
          successHandler(req, res, result, 'Update successful - Subject');
          logger.info(`Subject ${req.body.name} updated`);
        }
      },
    );
  },
);

export default subject;
