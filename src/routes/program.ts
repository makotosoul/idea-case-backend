import express from 'express';
import db from '../db/index.js';
import db_knex from '../db/index_knex.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

const program = express.Router();

// Program id:s and name:s, to be used in a select list
program.get('/getSelectData', (req, res) => {
  const sqlSelectName = 'SELECT id, name FROM Program';
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Program');
    } else {
      successHandler(req, res, result, 'getNames successful - Program');
    }
  });
});

program.get('/:id', (req, res) => {
  db_knex('Program')
    .select()
    .where('id', req.params.id)
    .then((data) => {
      successHandler(req, res, data, 'Succesfully read the programs from DB');
    })
    .catch((err) => {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Program');
    });
});

export default program;
