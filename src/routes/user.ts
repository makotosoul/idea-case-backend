import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
  authenticationErrorHandler,
} from '../responseHandler/index.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { Request, Response } from 'express';

dotenv.config({});

const user = express.Router();

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

user.post('/login', (req, res) => {
  console.log(`Login, password: ${req.body.password}`);
  db_knex('User')
    .select('email', 'password', 'isAdmin', 'isPlanner', 'isStatist')
    .where('email', req.body.email)
    .then((data) => {
      bcrypt
        .compare(req.body.password, data[0].password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            authenticationErrorHandler(req, res, "Passwords don't match!");
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
            successHandler(req, res, updatedData, 'Ok');
          }
        })
        .catch((err) => {
          requestErrorHandler(
            req,
            res,
            `${err} Oops! Nothing came through - User`,
          );
        });
    })
    .catch((error) => {
      dbErrorHandler(req, res, error, 'Database error');
    });
});

export default user;
