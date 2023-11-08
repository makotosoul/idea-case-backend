import express, { Request, Response } from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
} from '../responseHandler/index.js';
import { validateUserIdAndDepartmentId } from '../validationHandler/departmentPlanner.js';
import { validate } from '../validationHandler/index.js';
import { validateUserId } from '../validationHandler/user.js';

const departmentplanner = express.Router();

//get all departmentplanner for a single user based on id
departmentplanner.get(
  '/:userId',
  validateUserId,
  [validate],
  (req: Request, res: Response) => {
    const userId = req.params.userId;
    db_knex
      .select('name', 'id', 'userId')
      .from('Department')
      .innerJoin('DepartmentPlanner', 'departmentId', 'id')
      .where('userId', userId)
      .then((result) => {
        successHandler(
          req,
          res,
          result,
          'getDepartmentplanners successful - Departmentplanner',
        );
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! Nothing came through - Departmentplanner',
        );
      });
  },
);

// Adding a new departmentplanner
departmentplanner.post(
  '/',
  validateUserIdAndDepartmentId,
  [validate],
  (req: Request, res: Response) => {
    const plannerData = {
      userId: req.body.userId,
      departmentId: req.body.departmentId,
    };
    db_knex('DepartmentPlanner')
      .insert(plannerData)
      .then((result) => {
        if (result.length === 0) {
          requestErrorHandler(req, res, 'Nothing to insert');
        } else {
          successHandler(
            req,
            res,
            { insertId: result[0] }, // Assuming auto-incremented ID
            'Departmentplanner created successfully.',
          );
        }
      })
      .catch((error) => {
        requestErrorHandler(
          req,
          res,
          `Oops! Create failed - DepartmentPlanner: ${error.message}`,
        );
      });
  },
);

//deleting a departmentplanner
departmentplanner.delete(
  '/:userId/:departmentId',
  validateUserIdAndDepartmentId,
  [validate],
  (req: Request, res: Response) => {
    const userId = req.params.userId;
    const departmentId = req.params.departmentId;
    db_knex('DepartmentPlanner')
      .delete()
      .where('userId', userId)
      .andWhere('departmentId', departmentId)
      .then((result) => {
        if (!result) {
          requestErrorHandler(req, res, 'Nothing to delete');
        } else {
          successHandler(
            req,
            res,
            result,
            'Delete successful - DepartmentPlanner',
          );
        }
      })
      .catch((error) => {
        dbErrorHandler(
          req,
          res,
          error,
          'Oops! delete failed - DepartmentPlanner',
        );
      });
  },
);

export default departmentplanner;
