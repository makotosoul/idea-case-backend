import express, { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  authenticationErrorHandler,
  authorizationErrorHandler,
} from '../responseHandler/index.js';
import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { validate } from '../validationHandler/index.js';

dotenv.config({});

const user = express.Router();

//adding user
user.post(
  '/',
  [authenticator, admin, roleChecker],
  (req: Request, res: Response) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(
      `Register, clear text password from frontend: ${req.body.password}`,
    ); // REMOVE AFTER SOME TESTING!!! SECURITY!!!
    req.body.password = hashedPassword;
    console.log(`Register, password hashed for DB: ${req.body.password}`); // REMOVE AFTER SOME TESTING!!! SECURITY!!!
    db_knex
      .insert(req.body)
      .into('User')
      .then((idArray) => {
        successHandler(req, res, idArray, 'Adding user success');
      })
      .catch((error) => {
        if (error.errno === 1062 || error.errno === 1169) {
          requestErrorHandler(
            req,
            res,
            `User with that email ${req.body.email} already exists`,
          );
        } else {
          dbErrorHandler(req, res, error, 'Some DB error while adding user');
        }
      });
  },
);

// Fetching all users
user.get(
  '/',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    db_knex
      .select(
        'u.id',
        'u.email',
        'u.isAdmin',
        'u.isPlanner',
        'u.isStatist',
        db_knex.raw(
          "GROUP_CONCAT(d.name SEPARATOR ' | ') as 'plannerdepartment'",
        ),
      )
      .from('User as u')
      .leftJoin('DepartmentPlanner as dp', 'u.id', 'dp.userid')
      .leftJoin('Department as d', 'dp.departmentid', 'd.id')
      .groupBy('u.id')
      .then((users) => {
        successHandler(req, res, users, 'getAll successful - Users');
      })
      .catch((error) => {
        dbErrorHandler(req, res, error, 'Oops! Nothing came through - Users');
      });
  },
);

//handling login for registered user
user.post('/login', (req, res) => {
  console.log(`Login, password: ${req.body.password}`);
  db_knex('User')
    .select('email', 'password', 'isAdmin', 'isPlanner', 'isStatist')
    .where('email', req.body.email)
    .then((data) => {
      if (data.length === 1) {
        bcrypt
          .compare(req.body.password, data[0].password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              authenticationErrorHandler(
                req,
                res,
                "/login: Passwords don't match!",
              );
              return;
            } else {
              const token = jsonwebtoken.sign(
                {
                  email: data[0].email,
                  isAdmin: data[0].isAdmin,
                  isPlanner: data[0].isPlanner,
                  isStatist: data[0].isStatist,
                },
                process.env.SECRET_TOKEN as string,
                { expiresIn: '24h' },
              );
              const updatedData = data.map((obj) => ({ ...obj, token }));
              successHandler(req, res, updatedData, '/login: Ok');
            }
          })
          .catch((err) => {
            requestErrorHandler(
              req,
              res,
              `${err} /login: Oops! Nothing came through - User`,
            );
          });
      } else {
        authenticationErrorHandler(
          req,
          res,
          `login with email '${req.body.email}' not found`,
        );
      }
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, '/login: Database error');
    });
});

export default user;
