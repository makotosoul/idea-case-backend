import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';

const user = express.Router();

user.post('/', (req, res) => {
  db_knex
    .insert(req.body)
    .into('User')
    .then((idArray) => {
      successHandler(res, idArray, 'Adding user success');
    })
    .catch((error) => {
      console.log(error);
    });
});

user.get('/:email', (req, res) => {
  db_knex('User')
    .select('email', 'password', 'isAdmin')
    .where('email', req.params.email)
    .then((data) => {
      successHandler(res, data, 'Ok');
    })
    .catch((err) => {
      requestErrorHandler(res, `${err} Oops! Nothing came through - User`);
    });
});

export default user;
