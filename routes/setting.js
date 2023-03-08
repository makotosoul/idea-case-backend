import express from 'express';
const setting = express.Router();
import db from '../db/index.js';
import {
    dbErrorHandler,
    successHandler,
  } from '../responseHandler/index.js';

setting.get("", (req, res) => {
  const sqlSelectName =
    "SELECT id, name, description, numberValue, textValue FROM GlobalSetting";
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Setting");
    } else {
      successHandler(res, result, "getNames successful - Setting");
    }
  });
});

setting.get("/:id", (req, res) => {
  const id = req.params.id;
  const sqlSelectName =
    `SELECT id, name, description, numberValue, textValue FROM GlobalSetting WHERE id=${db.escape(id)}`
  db.query(sqlSelectName, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Setting");
    } else {
      successHandler(res, result, "getNames successful - Setting");
    }
  });
});

export default setting;