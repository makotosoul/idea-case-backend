import express from 'express';
const setting = express.Router();
import logger from '../utils/logger.js';
import db from '../db/index.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validateAddSetting } from '../validationHandler/index.js';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

setting.get('', (req, res) => {
  const sqlSelectName =
    'SELECT id, name, description, numberValue, textValue FROM GlobalSetting';
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, 'Oops! Nothing came through - Setting');
    } else {
      successHandler(res, result, 'getNames successful - Setting');
    }
  });
});

setting.get('/:id', (req, res) => {
  const id = req.params.id;
  const sqlSelectName = `SELECT id, name, description, numberValue, textValue FROM GlobalSetting WHERE id=${db.escape(
    id,
  )}`;
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, 'Oops! Nothing came through - Setting');
    } else {
      successHandler(res, result, 'getNames successful - Setting');
    }
  });
});

// Removing a setting
setting.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sqlDelete = 'DELETE FROM GlobalSetting WHERE id = ?;';
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      dbErrorHandler(res, err, 'Oops! Delete failed - GlobalSetting');
    } else {
      successHandler(res, result, 'Delete successful - GlobalSetting');
      logger.info('GlobalSetting deleted');
    }
  });
});

//Creating a setting
setting.post(
  '/postSetting',
  validateAddSetting,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation error:  %O', errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, 'Formatting problem');
    }
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const numberValue = req.body.numberValue;
    const textValue = req.body.textValue;
    const sqlInsert =
      'INSERT INTO GlobalSetting (id, name, description, numberValue, textValue) VALUES (?,?,?,?,?)';
    db.query(
      sqlInsert,
      [id, name, description, numberValue, textValue],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, `${err}: Nothing to insert`);
        } else if (err) {
          dbErrorHandler(res, err, 'Oops! Create failed - GlobalSetting');
        } else {
          successHandler(
            res,
            { insertId: result.insertId },
            'Create successful - GlobalSetting',
          );
          logger.info(`GlobalSetting created id ${req.body.id}`);
        }
      },
    );
  },
);

// Updating setting
setting.put(
  '/updateSetting',
  validateAddSetting,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation error: %0', errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, 'Formatting problem');
    }
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const numberValue = req.body.numberValue;
    const textValue = req.body.textValue;
    const sqlUpdate =
      ' UPDATE GlobalSetting SET name = ?, description= ?, numberValue= ?, textValue= ? WHERE id = ?;';
    db.query(
      sqlUpdate,
      [id, name, description, numberValue, textValue],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, `${err}: Nothing to update`);
        } else if (err) {
          dbErrorHandler(res, err, 'Oops! Update failed - GlobalSetting');
        } else {
          successHandler(res, result, 'Update successful - GlobalSetting');
          logger.info('GlobalSetting ', req.body.id, ' updated');
        }
      },
    );
  },
);

export default setting;
