const db = require("../db/index");

/* Get all allocations */

const getAll = () => {
  const sqlQuery =
    "SELECT id, name, isSeasonAlloc, description, lastmodified FROM AllocRound ar;";
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) return reject(err);
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
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get all subjects in allocation by id
const getAllSubjectsById = (id) => {
  const allocRound = id;
  const sqlQuery = `SELECT 
        s.id, 
        s.name, 
        as2.isAllocated, 
        as2.cantAllocate,
        as2.priority,
        IFNULL((SELECT CAST(SUM(TIME_TO_SEC(al_sp.totalTime)/3600) AS DECIMAL(10,1))
            FROM AllocSpace al_sp
            WHERE al_sp.allocRound = ? AND al_sp.subjectId = s.id
            GROUP BY al_sp.subjectId), 0) AS "AllocatedHours",
        CAST((TIME_TO_SEC(s.sessionLength) * s.groupCount * s.sessionCount / 3600) AS DECIMAL(10,1)) AS "requiredHours"
    FROM Subject s
    INNER JOIN AllocSubject as2 ON s.id = as2.subjectId
    LEFT JOIN AllocSpace al_sp ON s.id = al_sp.subjectId
    WHERE as2.allocRound = ?
    GROUP BY s.id
    ORDER BY as2.priority ASC;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [allocRound, allocRound], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Get all subjects in space by allocRoundId and SpaceId*/

const getSubjectsByAllocRoundAndSpaceId = (allocRound, spaceId) => {
  const sqlQuery = `
    SELECT 
    	s.id, 
    	s.name, 
    	CAST((TIME_TO_SEC(al_sp.totalTime) / 3600) AS DECIMAL(10,1)) AS "allocatedHours"
    FROM AllocSpace al_sp
    INNER JOIN Subject s ON al_sp.subjectId = s.id 
    WHERE al_sp.allocRound = ? AND al_sp.spaceId = ?;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [allocRound, spaceId], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Get rooms by Subject and AllocRound */

const getRoomsBySubjectAndAllocRound = (subjectId, allocRound) => {
  const sqlQuery = `
    SELECT s.id, s.name, CAST(TIME_TO_SEC(as2.totalTime)/3600 AS DECIMAL(10,1)) AS "allocatedHours"
    FROM Space s
    INNER JOIN AllocSpace as2 ON s.id = as2.spaceId
    WHERE as2.subjectId = ? AND as2.allocRound = ?;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [subjectId, allocRound], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Get allocated rooms with allocatedHours */

const getRoomsByAllocId = (allocRoundId) => {
  const sqlQuery = `SELECT 
        id, 
        name, 
        CAST(SUM(TIME_TO_SEC(AllocSpace.totalTime))/3600 AS DECIMAL(10,1)) AS 'allocatedHours', 
        HOUR(TIMEDIFF(Space.availableTO, Space.availableFrom))*5 AS 'requiredHours' 
    FROM Space 
    LEFT JOIN AllocSpace ON Space.id = AllocSpace.spaceId 
    WHERE AllocSpace.allocRound = ? 
    GROUP BY id
    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocRoundId, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/* Get allocated rooms by Program.id and AllocRound.id */

const getAllocatedRoomsByProgram = async (programId, allocId) => {
  const sqlQuery = `SELECT DISTINCT s.id, s.name, CAST(SUM(TIME_TO_SEC(as2.totalTime)/3600) AS DECIMAL(10,1)) AS allocatedHours 
                    FROM AllocSpace as2
                    LEFT JOIN Space s ON as2.spaceId = s.id
                    LEFT JOIN Subject s2 ON as2.subjectId = s2.id
                    LEFT JOIN Program p ON s2.programId = p.id 
                    WHERE p.id = ? AND as2.allocRound = ?
                    GROUP BY s.id
                    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [programId, allocId], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Get subjects by Program.id and AllocRound.id */

const getSubjectsByProgram = (allocRound, programId) => {
  const sqlQuery = `
    SELECT 
    	s.id, 
    	s.name, 
    	CAST(SUM(TIME_TO_SEC(as2.totalTime) / 3600) AS DECIMAL(10,1)) AS "allocatedHours",
        CAST((s.groupCount * TIME_TO_SEC(s.sessionLength) * s.sessionCount / 3600) AS DECIMAL(10,1)) as "requiredHours"
        FROM Subject s
    JOIN Program p ON s.programId = p.id
    JOIN AllocSpace as2 ON s.id = as2.subjectId
    WHERE p.id = ? AND as2.allocRound = ?
    GROUP BY as2.subjectId;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [programId, allocRound], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Priorisoi allocRoundin subjectit - KESKEN!

const getPriorityOrder = (allocRound) => {
  const sqlQuery = `SELECT as2.subjectId, as2.allocRound, MAX(sub_eqp.priority) AS priority 
                        FROM AllocSubject as2 
                        LEFT JOIN SubjectEquipment sub_eqp ON as2.subjectId = sub_eqp.subjectId
                        WHERE as2.allocRound = ? 
                        GROUP BY as2.subjectId 
                        ORDER BY sub_eqp.priority DESC 
                    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocRound, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Päivittää priorisointinumeron allocSubjetissa - KESKEN!

const updateAllocSubjectPriority = (subjectId, allocRound, priorityNumber) => {
  const sqlQuery = `UPDATE AllocSubject
                        SET priority = ?
                        WHERE subjectId = ? AND allocRound = ?
                        ;`;
  return new Promise((resolve, reject) => {
    db.query(
      sqlQuery,
      [priorityNumber, subjectId, allocRound],
      (err, result) => {
        if (err) {
          return reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
};

// Etsii subjectille huoneet allokointia varten - KESKEN!

const findRoomsForSubject = (subjectId) => {
  const sqlQuery = `
                        SELECT sp.id, sp.personLimit, sp.area
                        FROM Space sp
                        WHERE sp.personLimit >= (SELECT groupSize FROM Subject WHERE id=?)
                        AND sp.area >= (SELECT s.area FROM Subject s WHERE id=?)
                        AND sp.spaceTypeId = (SELECT s.spaceTypeId FROM Subject s WHERE id=?)
                        AND sp.inUse=1
                        ORDER BY sp.area ASC, sp.personLimit ASC
                        ; 
                    `;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [subjectId, subjectId, subjectId], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Delete all subjects in allocSpace with allocround.id */

const deleteAllSpacesInAllocRound = (allocRound) => {
  const sqlQuery = "DELETE FROM AllocSpace WHERE allocRound = ?;";

  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocRound, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* Reset non-allocated values in allocSubject */

const resetAllocSubject = (allocRound) => {
  const sqlQuery =
    "UPDATE AllocSubject SET isAllocated = 0, priority = null, cantAllocate = 0 WHERE allocRound = ?;";

  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocRound, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAll,
  getById,
  getAllSubjectsById,
  getSubjectsByAllocRoundAndSpaceId,
  getRoomsBySubjectAndAllocRound,
  getRoomsByAllocId,
  getSubjectsByProgram,
  getAllocatedRoomsByProgram,
  getPriorityOrder,
  updateAllocSubjectPriority,
  deleteAllSpacesInAllocRound,
  findRoomsForSubject,
  resetAllocSubject,
};
