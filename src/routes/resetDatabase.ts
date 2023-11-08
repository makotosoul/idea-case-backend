import fs from 'fs';
import express, { Request, Response } from 'express';
import mysql from 'mysql';
import { admin } from '../authorization/admin.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { authenticator } from '../authorization/userValidation.js';
import knex from '../db/index_knex.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';
import { validate } from '../validationHandler/index.js';

const resetDatabase = express.Router();

//creating connection to database and enabling execution of multiple sql statements
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'casedb',
  multipleStatements: true,
});

//reading sql statements from the file
const sqlStatements = fs
  .readFileSync('./Database/SQL_Scripts/000_CreateALLdb.sql')
  .toString();

// //executing the statements through the resetDatabase route with get method using mysql
// resetDatabase.get(
//   '/',
//   [authenticator, admin, roleChecker, validate],
//   (req: Request, res: Response) => {
//     // connection.query(sqlStatements, (err, results, fields) => {
//     //   !err
//     //     ? successHandler(req, res, results, 'Database reset success!')
//     //     : dbErrorHandler(req, res, err, 'Database reset failed!');
//     // });
//   },
// );

//executing the statements through the resetDatabase route with get method using knex
resetDatabase.get(
  '/',
  [authenticator, admin, roleChecker, validate],
  (req: Request, res: Response) => {
    knex
      .raw(sqlStatements)
      .then((data) => successHandler(req, res, data, 'Database reset success!'))
      .catch((err) => dbErrorHandler(req, res, err, 'Database reset failed!'));
  },
);

export default resetDatabase;
