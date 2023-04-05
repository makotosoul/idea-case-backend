import express from 'express';
const setting = express.Router();
import logger from '../utils/logger.js';
import db from '../db/index_knex.js';
import {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import { validateAddSetting } from '../validationHandler/index.js';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

setting.get('/', (req, res) => {
  db('GlobalSetting')
    .select()
    .then((data) => {
      successHandler(res, data, 'Successfully read the settings from DB');
    })
    .catch((err) => {
      dbErrorHandler(res, err, 'Error trying to read all settings from DB');
    });
});

setting.get('/:id', (req, res) => {
  db('GlobalSetting')
    .select()
    .where('id', req.params.id)
    .then((data) => {
      successHandler(res, data, 'Successfully read the settings from DB');
    })
    .catch((err) => {
      dbErrorHandler(res, err, 'Oops! Nothing came through - GlobalSetting');
    });
});

setting.delete('/delete/:id', (req, res) => {
  db('GlobalSetting')
    .select()
    .where('id', req.params.id)
    .del()
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(
          res,
          rowsAffected,
          `Delete succesfull! Count of deleted rows: ${rowsAffected}`,
        );
      } else {
        requestErrorHandler(res, `Invalid setting id:${req.params.id}`);
      }
    })
    .catch((error) => {
      dbErrorHandler(res, error, 'Error delete failed');
    });
});

setting.post(
  '/postSetting',
  validateAddSetting,
  (req: Request, res: Response) => {
    const valResult = validationResult(req);

    if (!valResult.isEmpty()) {
      return validationErrorHandler(
        res,
        `${valResult}validateAddSetting error`,
      );
    }

    db('GlobalSetting')
      .insert(req.body)
      .into('GlobalSetting')
      .then((idArray) => {
        successHandler(
          res,
          idArray,
          'Adding a setting, or multiple settings was succesful',
        );
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            res,
            `Conflict: Setting with the name ${req.body.name} already exists!`,
          );
        } else if (error.errno === 1054) {
          requestErrorHandler(
            res,
            "error in spelling [either in 'name' and/or in 'description'].",
          );
        } else {
          dbErrorHandler(res, error, 'error adding setting');
        }
      });
  },
);

setting.put('/updateSetting', (req, res) => {
  if (!req.body.name) {
    requestErrorHandler(res, 'Setting name is missing.');
  } else {
    db('GlobalSetting')
      .where('id', req.body.id)
      .update(req.body)
      .then((rowsAffected) => {
        if (rowsAffected === 1) {
          successHandler(
            res,
            rowsAffected,
            `Update setting successful! Count of modified rows: ${rowsAffected}`,
          );
        } else {
          requestErrorHandler(
            res,
            `Update setting not successful, ${rowsAffected} row modified`,
          );
        }
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            res,
            `DB 1062: Setting with the name ${req.body.name} already exists!`,
          );
        } else if (error.errno === 1054) {
          requestErrorHandler(
            res,
            "error in spelling [either in 'name' and/or in 'description'].",
          );
        } else {
          dbErrorHandler(res, error, 'error updating setting');
        }
      });
  }
});

export default setting;
