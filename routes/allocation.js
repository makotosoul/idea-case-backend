const express = require("express");
const allocation = express.Router();
// const db = require("../db/index");
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

const programService = require("../services/program");
const allocationService = require("../services/allocation");

/* Get all allocations */

allocation.get("/all", (req, res) => {
  allocationService
    .getAll()
    .then((data) => {
      successHandler(res, data, "getAll succesful - Allocation");
    })
    .catch((err) => {
      dbErrorHandler(
        res,
        err,
        "Oops! Nothing came through - Allocation getAll",
      );
    });
});

/* Get allocation by id */

allocation.get("/:id", (req, res) => {
  allocationService
    .getById(req.params.id)
    .then((data) => {
      successHandler(res, data, "getById succesful - Allocation");
    })
    .catch((err) => {
      dbErrorHandler(
        res,
        err,
        "Oops! Nothing came through - Allocation getById",
      );
    });
});

/* Get rooms with allocated hours by allocationId */

allocation.get("/:id/rooms", (req, res) => {
  const id = req.params.id;
  allocationService
    .getRoomsByAllocId(id)
    .then((data) => {
      successHandler(res, data, "getById succesful - Allocation");
    })
    .catch((err) => {
      dbErrorHandler(
        res,
        err,
        "Oops! Nothing came through - Allocation getById",
      );
    });
});

/* Get all allocated rooms by allocationId and program.id */

allocation.get("/:id/program/all/rooms", async (req, res) => {
  const id = req.params.id;
  programService
    .getAll()
    .then(async (programs) => {
      for (let [index, program] of programs.entries()) {
        programs[index] = {
          ...program,
          rooms: await allocationService.getAllocatedRoomsByProgram(
            program.id,
            id,
          ),
        };
      }
      return programs;
    })
    .then((data) => {
      successHandler(res, data, "getRoomsByProgram succesful - Allocation");
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    });
});

/* ALL BELOW THIS IN PROGRESS */
/*
// Test parser with Json Object 
const jsonParser = (list, property) => {
    try {
        for (let [index, object] of list.entries()) {
            list[index][property] = JSON.parse(object[property]);
        }
        return list
    }
    catch(err){
        console.error(err);
    }
};




// Allocation rooms by program 
allocation.get("/:id/program/rooms", (req, res) => {
    const id = req.params.id;
    const sqlQuery = 
    `SELECT 
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
    `
    db.query(sqlQuery, (err, result) => {
        if(err){
            dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
        } else {
            let parsedResult = jsonParser(result, 'rooms');
            successHandler(res, parsedResult, "getRoomsByProgram succesful - Allocation");
        }
    })

});

// TESTING 


const getRoomsQuery = (program) => {
    const sqlRoomsQuery = `SELECT DISTINCT s.id, s.name, SUM(HOUR(as2.totalTime)) AS allocatedHours
    FROM AllocSpace as2
    LEFT JOIN Space s ON as2.spaceId = s.id
    LEFT JOIN Subject s2 ON as2.allocSubjectId = s2.id
    LEFT JOIN Program p ON s2.programId = p.id 
    WHERE p.id = ? AND as2.allocRound = 10002
    GROUP BY s.id
    ;`
    const id = program.id;
    return new Promise((resolve, reject) => {
        db.query(sqlRoomsQuery, id, (err, result) => {
            if (err) throw reject(err)
            resolve({program, 'rooms' : res});
        })
    })
}



// Allocation rooms by program - with json_object select 

allocation.get("/test/", (req, res) => {
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
    ;`
    db.query(sqlQuery, (err, result) => {
        if(err){
            dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
        } else {
            let parsedlist = jsonParser(result, 'program');
            console.log(parsedlist);
            successHandler(res, parsedlist, "getRoomsByProgram succesful - Allocation");
        }
    })
})

*/

module.exports = allocation;
