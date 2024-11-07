import express, { Request, Response } from 'express';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { statist } from '../authorization/statist.js';
import { authenticator } from '../authorization/userValidation.js';
import db_knex from '../db/index_knex.js';
import {
    dbErrorHandler,
    requestErrorHandler,
    successHandler,
} from '../responseHandler/index.js';
import { Subject } from '../types/custom.js';
import logger from '../utils/logger.js';
import { validateAllocRoundId } from '../validationHandler/allocRound.js';
import {
    // This is the new validation result handler
    validate,
    validateIdObl,
    // (our express-compatible middleware function for the req handling chain)
} from '../validationHandler/index.js';
import {
    validateSubjectMultiPost,
    validateSubjectPost,
    validateSubjectPut,
} from '../validationHandler/subject.js';

const city = express.Router();

//list all city order by id in asc order
city.get('/', [validate], (req: Request, res: Response) => {
    db_knex.select('c.id', 'c.name', 'c.established', 'c.averageTemp')
        .from('City as c')
        .orderBy('c.id', 'asc')
        .then((cities) => {
            successHandler(req, res, cities, 'getAll successful - City');
        })

        .catch((error) => {
            dbErrorHandler(req, res, error, 'Oops! Nothing came through - City');
        })

})

//get a specifc category by id
city.get(
    '/:id',
    validateIdObl,
    [validate],
    (req: Request, res: Response) => {
        db_knex
            .select(
                'c.id',
                'c.name',
                'c.established',
                'c.averageTemp',
            )
            .from('City as c')
            .where('c.id', req.params.id)
            .then((data) => {
                if (data.length === 1) {
                    successHandler(
                        req,
                        res,
                        data,
                        `City successfully fetched with id ${req.params.id}`,
                    );
                } else {
                    requestErrorHandler(
                        req,
                        res,
                        `Non-existing city id: ${req.params.id}`,
                    );
                }
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, '');
            });
    },
);

//creating a city
city.post('/',
    [validate],
    (req: Request, res: Response) => {
        db_knex('City')
            .insert(req.body)
            .into('City')
            .then((idArray) => {
                successHandler(
                    req,
                    res,
                    idArray,
                    'Adding a city was succesful',
                );
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, 'error adding city');
            });
    },
)
//updating a city
city.put(
  '/',
  [validate],
  (req: Request, res: Response) => {
    if (!req.body.name) {
      requestErrorHandler(req, res, 'City name is missing.');
    } else {
      db_knex('City')
        .where('id', req.body.id)
        .update(req.body)
        .then((rowsAffected) => {
          if (rowsAffected === 1) {
            successHandler(
              req,
              res,
              rowsAffected,
              `Update City successful! Count of modified rows: ${rowsAffected}`,
            );
          } else {
            requestErrorHandler(
              req,
              res,
              `Update City not successful, ${rowsAffected} row modified`,
            );
          }
        })
        .catch((error) => {
          dbErrorHandler(req, res, error, 'error updating city');
        });
    }
  },
);

//deleting a city
city.delete(
  '/:id',
  [validate],
  (req: Request, res: Response) => {
    db_knex('City')
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
          requestErrorHandler(req, res, `Invalid city id:${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting city');
      });
  },
);

//get a list of city by text
city.get(
    '/parameter/:text',
    (req: Request, res: Response) => {
        db_knex
            .select(
                'c.id',
                'c.name',
                'c.established',
                'c.averageTemp',
            )
            .from('City as c')
            .whereLike('c.name', `%${req.params.text}%`)
            .then((data) => {
                if (data.length >= 1) {
                    successHandler(
                        req,
                        res,
                        data,
                        `City successfully fetched with ${req.params.text}`,
                    );
                } else {
                    requestErrorHandler(
                        req,
                        res,
                        `Non-existing city text: ${req.params.text}`,
                    );
                }
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, '');
            });
    },
);

city.get(
    '/before/:date',
    (req: Request, res: Response) => {
      const date = new Date(req.params.date)
        db_knex
            .select(
                'c.id',
                'c.name',
                'c.established',
                'c.averageTemp',
            )
            .from('City as c')
            .whereRaw('c.established < ?', [date.toISOString()])
            .then((data) => {
                if (data.length >= 1) {
                    successHandler(
                        req,
                        res,
                        data,
                        `City successfully fetched with ${req.params.date}`,
                    );
                } else {
                    requestErrorHandler(
                        req,
                        res,
                        `Non-existing city text: ${req.params.date}`,
                    );
                }
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, '');
            });
    },
);
export default city;

