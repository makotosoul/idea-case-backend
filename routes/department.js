import express from "express";
import db_knex from "../db/index_knex.js";
import {
	requestErrorHandler,
	successHandler,
} from "../responseHandler/index.js";

const department = express.Router();

department.get("/getDeptData", (req, res) => {
	db_knex("Department")
		.select("id", "name", "description")
		.then((data) => {
			successHandler(res, data, "GetDeptData succesful -Department");
		})
		.catch((err) => {
			requestErrorHandler(res, err, "Oops! Nothing came through - Department");
		});
});

export default department;
