import express from 'express';
import db from '../db/index_knex.js';
import { dbErrorHandler, successHandler, requestErrorHandler } from '../responseHandler/index.js';

const building = express.Router();

building.get("/", (req, res) => {
  db("Building").select()
    .then((data) => {
      successHandler(res, JSON.stringify(data), "Successfully read the buildings from DB");
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Error trying to read all buildings from DB");
    });
});

building.get("/:id", (req, res) => {
  db("Building").select().where("id", req.params.id)
    .then(data => {
      successHandler(res, JSON.stringify(data), "Successfully read the buildings from DB");
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Oops! Nothing came through - Building");
    });
})

building.delete("/:id", (req, res) => {
  db("Building").select().where("id", req.params.id)
    .del()
    .then(rowsAffected => {
      if (rowsAffected === 1) {
        successHandler(res, JSON.stringify(rowsAffected), "Delete succesfull! Count of deleted rows: " + rowsAffected);
      } else {
        requestErrorHandler(res, "Invalid category id:" + req.params.id);
      }
    })
    .catch(error => {
      dbErrorHandler(res, error, "Error delete failed")
    });
});

export default building;