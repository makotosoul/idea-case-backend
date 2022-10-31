const express = require("express");
const allocation = express.Router();
const db = require("../db/index");
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

/* Get all allocations */

allocation.get("/all", (req, res) => {
  sqlQuery = `SELECT id, name, isSeasonAlloc, description, lastmodified
                FROM AllocRound ar;`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    } else {
      successHandler(res, result, "getAllocations succesful - Allocation");
    }
  });
});

/* Get allocation by id */

allocation.get("/:id", (req, res) => {
  const id = req.params.id;
  sqlQuery = `SELECT id, name, isSeasonAlloc, description, lastmodified
                FROM AllocRound ar
                WHERE id=?;`;
  db.query(sqlQuery, id, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    } else {
      successHandler(res, result, "getAllocations succesful - Allocation");
    }
  });
});

/* Get rooms with allocated hours by allocationId */
allocation.get("/:id/rooms", (req, res) => {
  const id = req.params.id;
  const sqlSelectRooms = `SELECT 
                        id, 
                        name, 
                        SUM(HOUR(AllocSpace.totalTime)) AS 'allocatedHours', 
                        HOUR(TIMEDIFF(Space.availableTO, Space.availableFrom))*5 AS 'requiredHours' 
                        FROM Space 
                        LEFT JOIN AllocSpace ON Space.id = AllocSpace.spaceId 
                        WHERE AllocSpace.allocRound = ? 
                        GROUP BY id
                    ;`;
  db.query(sqlSelectRooms, id, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    } else {
      successHandler(res, result, "getRooms successful - Allocation");
    }
  });
});

/* ALL BELOW THIS IN DEVELOPMENT */

/* Test parser with Json Object */

const jsonParser = (list, property) => {
  try {
    for (let [index, object] of list.entries()) {
      list[index][property] = JSON.parse(object[property]);
    }
    return list;
  } catch (err) {
    console.error(err);
  }
};

/* Allocation rooms by program */
allocation.get("/:id/program/rooms", (req, res) => {
  const id = req.params.id;
  const sqlQuery = `SELECT 
	    p.id, 
	    p.name,
	    IF(COUNT(as2.totalTime) = 0, JSON_ARRAY(),
	        JSON_ARRAYAGG(
	            JSON_OBJECT(
		        'id', sp.id,
		        'name', sp.name,
		        'allocatedHours', HOUR(as2.totalTime)
		    )
        )) AS rooms
    FROM Program p
    LEFT JOIN Subject s ON p.id = s.programId
    LEFT JOIN AllocSpace as2 ON s.id = as2.allocSubjectId
    LEFT JOIN Space sp ON as2.spaceId = sp.id
    GROUP BY p.id
    ;
    `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    } else {
      let parsedResult = jsonParser(result, "rooms");
      successHandler(
        res,
        parsedResult,
        "getRoomsByProgram succesful - Allocation",
      );
    }
  });
});

/* Allocation rooms by program - with json_object select */

allocation.get("/test", (req, res) => {
  const sqlQuery = `
        SELECT JSON_OBJECT(
        'id', p.id,
        'name', p.name,
        'rooms', (SELECT JSON_ARRAYAGG(
                    IFNULL(NULL, 
                        JSON_OBJECT(
                            'id', sp.id,
                            'name', sp.name,
                            'allocatedHours', HOUR(as2.totalTime)
                    ))))
    ) program
    FROM Program p
    LEFT JOIN Subject s ON p.id = s.programId
    LEFT JOIN AllocSpace as2 ON s.id = as2.allocSubjectId
    LEFT JOIN Space sp ON as2.spaceId = sp.id
    GROUP BY p.id
    ;`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    } else {
      let parsedlist = jsonParser(result, "program");
      console.log(parsedlist);
      successHandler(
        res,
        parsedlist,
        "getRoomsByProgram succesful - Allocation",
      );
    }
  });
});

module.exports = allocation;
