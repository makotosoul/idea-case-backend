import express from 'express';
import { Response, Request } from 'express';

import db from '../db/index.js';
import db_knex from '../db/index_knex.js'; // knex available for new database operations

import logger from '../utils/logger.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
} from '../responseHandler/index.js';

import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { statist } from '../authorization/statist.js';
import { roleChecker } from '../authorization/roleChecker.js';
import {
  validateIdObl,
  validate, // This is the new validation result handler
  // (our express-compatible middleware function
  // for the req handling chain)
} from '../validationHandler/index.js';
import {
  validateSubjectPost,
  validateSubjectPut,
} from '../validationHandler/subject.js';

const subject = express.Router();

// Fetching all subjects, joining to each subject the program, and needed spacetype
/*subject.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    const sqlSelectSubjectProgram =
      '  SELECT s.id, s.name AS subjectName, s.groupSize, s.groupCount, s.sessionLength, s.sessionCount, s.area, s.programId, p.name AS programName, s.spaceTypeId, st.name AS spaceTypeName FROM Subject s JOIN Program p ON s.programId = p.id LEFT JOIN SpaceType st ON s.spaceTypeId = st.id;';
    db.query(sqlSelectSubjectProgram, (err, result) => {
      if (err) {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Subject');
      } else {
        successHandler(req, res, result, 'getAll successful - Subject');
      }
    });
  },
);*/

// Fetching all subjects, joining to each subject the program, and needed spacetype using Knex
subject.get(
  '/',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .select(
        's.id',
        's.name AS subjectName',
        's.groupSize',
        's.groupCount',
        's.sessionLength',
        's.sessionCount',
        's.area',
        's.programId',
        'p.name AS programName',
        's.spaceTypeId',
        'st.name AS spaceTypeName',
      )
      .from('Subject as s')
      .innerJoin('Program as p', 's.programId', 'p.id')
      .leftJoin('SpaceType as st', 's.spaceTypeId', 'st.id')
      .then((subjects) => {
        successHandler(req, res, subjects, 'getAll successful - Subject');
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Nothing came through - Subject');
      });
  },
);

// SPECIAL Listing all the subjects for selection dropdown etc. (Just name and id)
/*subject.get(
  '/getNames',
  [authenticator, roleChecker, validate],
  (req: Request, res: Response) => {
    const sqlSelectSubjectNames = 'SELECT id, name FROM Subject;';
    db.query(sqlSelectSubjectNames, (err, result) => {
      if (err) {
        dbErrorHandler(req, res, err, 'Oops! Nothing came through - Subject');
      } else {
        successHandler(req, res, result, 'getNames successful - Subject');
      }
    });
  },
);*/

// SPECIAL Listing all the subjects for selection dropdown etc. (Just name and id) using knex
subject.get(
  '/getNames',
  [authenticator, admin, roleChecker],
  (req: Request, res: Response) => {
    db_knex
      .select('id', 'name')
      .from('Subject')
      .then((subjectNames) => {
        successHandler(req, res, subjectNames, 'getNames successful - Subject');
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Nothing came through - Subject');
      });
  },
);

// Fetching one subject by id   A new one with Knex for a model
subject.get(
  '/:id',
  validateIdObl,
  [validate],
  (req: Request, res: Response) => {
    db_knex
      .select()
      .from('Subject')
      .where('id', req.params.id)
      .then((data) => {
        if (data.length === 1) {
          successHandler(
            req,
            res,
            data,
            `Subject successfully fetched with id ${req.params.id}`,
          );
        } else {
          requestErrorHandler(
            req,
            res,
            `Non-existing subject id: ${req.params.id}`,
          );
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, '');
      });
  },
);

// Adding a subject/teaching
/*subject.post(
  '/',
  validateSubjectPost,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
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
);*/

// Adding a subject/teaching using knex
subject.post(
  '/',
  validateSubjectPost,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
    const subjectData = {
      name: req.body.name,
      groupSize: req.body.groupSize,
      groupCount: req.body.groupCount,
      sessionLength: req.body.sessionLength,
      sessionCount: req.body.sessionCount,
      area: req.body.area,
      programId: req.body.programId,
      spaceTypeId: req.body.spaceTypeId,
    };

    db_knex('Subject')
      .insert(subjectData)
      .then((result) => {
        if (result.length === 0) {
          requestErrorHandler(req, res, 'Nothing to insert');
        } else {
          successHandler(
            req,
            res,
            { insertId: result[0] }, // Assuming auto-incremented ID
            'Create successful - Subject',
          );
          logger.info(`Subject ${subjectData.name} created`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Create failed - Subject');
      });
  },
);

// Modifying the subject/teaching
subject.put(
  '/',
  validateSubjectPut,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
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

// Removing a subject/teaching
subject.delete(
  '/:id',
  validateIdObl,
  [authenticator, admin, planner, roleChecker, validate],
  (req: Request, res: Response) => {
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
  },
);

export default subject;
