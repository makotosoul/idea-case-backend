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

const category = express.Router();

//list all category order by id in asc order
category.get('/', [validate], (req: Request, res: Response) => {
    db_knex.select('c.id', 'c.name')
        .from('Category as c')
        .orderBy('c.id', 'asc')
        .then((categories) => {
            successHandler(req, res, categories, 'getAll successful - Category');
        })

        .catch((error) => {
            dbErrorHandler(req, res, error, 'Oops! Nothing came through - Category');
        })

})

//get a specifc category by id
category.get(
    '/:id',
    validateIdObl,
    [validate],
    (req: Request, res: Response) => {
        db_knex
            .select(
                'c.id',
                'c.name',
            )
            .from('Category as c')
            .where('c.id', req.params.id)
            .then((data) => {
                if (data.length === 1) {
                    successHandler(
                        req,
                        res,
                        data,
                        `Category successfully fetched with id ${req.params.id}`,
                    );
                } else {
                    requestErrorHandler(
                        req,
                        res,
                        `Non-existing category id: ${req.params.id}`,
                    );
                }
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, '');
            });
    },
);

//creating a category
category.post('/',
    [validate],
    (req: Request, res: Response) => {
        db_knex('Category')
            .insert(req.body)
            .into('Category')
            .then((idArray) => {
                successHandler(
                    req,
                    res,
                    idArray,
                    'Adding a category, or multiple category was succesful',
                );
            })
            .catch((error) => {
                dbErrorHandler(req, res, error, 'error adding category');
            });
    },
)
//updating a category
category.put(
  '/',
  [validate],
  (req: Request, res: Response) => {
    if (!req.body.name) {
      requestErrorHandler(req, res, 'Category name is missing.');
    } else {
      db_knex('Category')
        .where('id', req.body.id)
        .update(req.body)
        .then((rowsAffected) => {
          if (rowsAffected === 1) {
            successHandler(
              req,
              res,
              rowsAffected,
              `Update Category successful! Count of modified rows: ${rowsAffected}`,
            );
          } else {
            requestErrorHandler(
              req,
              res,
              `Update Category not successful, ${rowsAffected} row modified`,
            );
          }
        })
        .catch((error) => {
          dbErrorHandler(req, res, error, 'error updating category');
        });
    }
  },
);

//deleting a category
category.delete(
  '/:id',
  [validate],
  (req: Request, res: Response) => {
    db_knex('Category')
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
          requestErrorHandler(req, res, `Invalid category id:${req.params.id}`);
        }
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Error deleting category');
      });
  },
);

export default category;

