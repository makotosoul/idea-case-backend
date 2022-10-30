const express = require("express");
const allocation = express.Router();
const db = require("../db/index");
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

/* Get all allocations */

allocation.get("", (req, res) => {
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

/* Get allocation with id */

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

/* Get all rooms in allocation with allocated hours */
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

const getAllPrograms = () => {
  return new Promise((resolve, reject) => {
    const sqlSelectData = "SELECT p.id, p.name FROM Program p;";
    db.query(sqlSelectData, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

allocation.get("/:id/getRoomsByProgram", (req, res) => {
  const id = req.params.id;
  getAllPrograms().then((programs) => {
    const sqlFindRooms = `
                    SELECT s.id, s.name, SUM(HOUR(totalTime)) AS allocatedHours
                    FROM AllocSpace as2
                    LEFT JOIN \`Space\` s ON as2.spaceId = s.id
                    LEFT JOIN Subject s2 ON as2.allocSubjectId = s2.id
                    LEFT JOIN Program p ON s2.programId = p.id
                    WHERE p.id = ? AND as2.allocRound = ?
                    GROUP BY s.id
                    ;`;
    programs.forEach((row, index) => {
      const programId = row.id;
      db.query(sqlFindRooms, [programId, id], (err, rooms) => {
        if (err) {
          dbErrorHandler(res, err, "Oops! Could not get rooms - Allocation");
        } else {
          programs[index] = { ...row, rooms: rooms };
        }
      });
    });
    successHandler(res, programs, "getPrograms successful - Allocation");
  });
});

module.exports = allocation;
