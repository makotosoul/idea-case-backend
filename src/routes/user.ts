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

export default user;
