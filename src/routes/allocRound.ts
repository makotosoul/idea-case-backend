import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  successHandler,
  validationErrorHandler,
  requestErrorHandler,
} from '../responseHandler/index.js';
import { validateAddUpdateAllocRound } from '../validationHandler/allocRound.js';
import { validationResult } from 'express-validator';
import { Response, Request } from 'express';

const allocround = express.Router();

// Adding an AllocRound
const userId = 201; //user id for adding new AllocRound

allocround.post(
  '/post',
  validateAddUpdateAllocRound,
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return validationErrorHandler(req, res, 'Formatting problem');
    }

    const allocRound = {
      name: req.body.name,
      description: req.body.description,
      userId: userId,
    };
    db_knex
      .insert(allocRound)
      .into('AllocRound')
      .then((idArray) => {
        successHandler(req, res, idArray, 'Adding an equipment was succesful.');
      })
      .catch((error) => {
        if (error.errno === 1062) {
          requestErrorHandler(
            req,
            res,
            `Conflict: AllocRound with the name ${req.body.name} already exists!`,
          );
        } else if (error.errno === 1052) {
          dbErrorHandler(req, res, error, 'Error in database column name');
        } else {
          dbErrorHandler(req, res, error, 'Error at adding equipment');
        }
      });
  },
);

// Delete allocround round
allocround.delete('/delete/:id', (req, res) => {
  db_knex('AllocRound')
    .select()
    .where('id', req.params.id)
    .del()
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(
          req,
          res,
          rowsAffected,
          `Delete succesfull! Count of deleted rows: ${rowsAffected}`,
        );
      } else {
        requestErrorHandler(req, res, `Invalid AllocRound id:${req.params.id}`);
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Error delete failed');
    });
});

// Update allocround round
allocround.put('/update', (req, res) => {
  const allocRound = {
    name: req.body.name,
    description: req.body.description,
  };

  db_knex('AllocRound')
    .where('id', req.body.id)
    .update(allocRound)
    .then((rowsAffected) => {
      if (rowsAffected === 1) {
        successHandler(req, res, rowsAffected, 'Updated succesfully');
      } else {
        requestErrorHandler(req, res, 'Error');
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Error at updating AllocRound');
    });
});

export default allocround;
