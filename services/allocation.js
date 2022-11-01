const db = require("../db/index");

/* Get all allocations */

const getAll = () => {
  const sqlQuery =
    "SELECT id, name, isSeasonAlloc, description, lastmodified FROM AllocRound ar;";

  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};

/* Get allocation by id */

const getById = (id) => {
  sqlQuery =
    "SELECT id, name, isSeasonAlloc, description, lastmodified FROM AllocRound ar WHERE id=?;";
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, id, (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};

/* Get allocated rooms in allocation with time */

const getRoomsByAllocId = (allocId) => {
  const sqlQuery = `SELECT 
        id, 
        name, 
        SUM(HOUR(AllocSpace.totalTime)) AS 'allocatedHours', 
        HOUR(TIMEDIFF(Space.availableTO, Space.availableFrom))*5 AS 'requiredHours' 
        FROM Space 
        LEFT JOIN AllocSpace ON Space.id = AllocSpace.spaceId 
        WHERE AllocSpace.allocRound = ? 
        GROUP BY id
    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocId, (err, result) => {
      if (err) throw reject(err);
      resolve(result);
    });
  });
};

/* ALL BELOW THIS STILL IN PROGRESS */
/* Get allocated rooms by Program.id and AllocRound.id */

const getAllocatedRoomsByProgram = async (programId, allocId) => {
  const sqlQuery = `SELECT DISTINCT s.id, s.name, SUM(HOUR(as2.totalTime)) AS allocatedHours
                    FROM AllocSpace as2
                    LEFT JOIN Space s ON as2.spaceId = s.id
                    LEFT JOIN Subject s2 ON as2.allocSubjectId = s2.id
                    LEFT JOIN Program p ON s2.programId = p.id 
                    WHERE p.id = ? AND as2.allocRound = ?
                    GROUP BY s.id
                    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [programId, allocId], (err, result) => {
      if (err) {
        throw reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAll,
  getById,
  getRoomsByAllocId,
  getAllocatedRoomsByProgram,
};
