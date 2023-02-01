import express from 'express';
import db from '../db/index_knex.js';
import { dbErrorHandler, successHandler } from '../responseHandler/index.js';

const building = express.Router();

building.get("/", (req, res) => {
  db("Building").select()
  .then( data => {
      successHandler(res,data,"Successfully read the buildings from DB");
  }) 
  .catch((err)=>{
      dbErrorHandler(res, err, "Oops! Nothing came through - SpaceType");      
  });
});

export default building;
