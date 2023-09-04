import db_knex from '../db/index_knex.js';
import db from '../db/index.js';
import {
  AllocatedRoomsByProgramType,
  AllocatedSubjectsByProgramType,
} from '../types.js';

/* Get all allocations */

const getAll = (): Promise<string> => {
  const sqlQuery =
    'SELECT id, name, isSeasonAlloc, description, lastModified FROM AllocRound ar;';
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/* Get allocation by id */
const getById = (id: number): Promise<string> => {
  const sqlQuery = `SELECT ar.id,
	            ar.name,
	            ar.isSeasonAlloc,
	            ar.description,
	            ar.lastModified,
	            ar.isAllocated, 
	            ar.processOn,
	            (SELECT COUNT(*) FROM AllocSubject WHERE AllocRound = ${db.escape(
                id,
              )}) AS 'Subjects',
	            (SELECT COUNT(*) FROM AllocSubject WHERE isAllocated = 1 AND AllocRound = ${db.escape(
                id,
              )}) AS 'allocated',
	            (SELECT COUNT(*) FROM AllocSubject WHERE isAllocated = 0 AND AllocRound = ${db.escape(
                id,
              )}) AS 'unAllocated'
	            FROM AllocRound ar 
	            WHERE ar.id=${db.escape(id)}`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get all subjects in allocation by id
const getAllSubjectsById = (id: number) => {
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

interface RoomsByAllocId {
  id: string;
  name: string;
  allocRoundId: string;
  requiredHours: string;
  spaceTypeId: string;
}

/* Get allocated rooms with allocatedHours */
const getRoomsByAllocId = (allocRoundId: number): Promise<RoomsByAllocId[]> => {
  return db_knex<RoomsByAllocId[]>('Space')
    .select('id', 'name')
    .select({
      allocatedHours: db_knex.raw(
        `(SELECT IFNULL(CAST(SUM(TIME_TO_SEC(AllocSpace.totalTime))/3600 AS DECIMAL(10,1)), 0) 
    FROM AllocSpace 
    WHERE spaceId = id 
    AND allocRound = ?
)`,
        allocRoundId,
      ),
    })
    .select({
      requiredHours: db_knex.raw(
        'HOUR(TIMEDIFF(Space.availableTO, Space.availableFrom))*5',
      ),
    })
    .select('spaceTypeId')
    .orderBy('allocatedHours', 'desc');
};

/* Get allocated rooms by Program.id and AllocRound.id */

const getAllocatedRoomsByProgram = async (
  programId: number,
  allocId: number,
): Promise<AllocatedRoomsByProgramType> => {
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

/* Get allocated rooms by Subject.id and AllocRound.id */
const getAllocatedRoomsBySubject = async (
  subjectId: number,
  allocId: number,
): Promise<string> => {
  const sqlQuery = `SELECT DISTINCT s.id, s.name, CAST(SUM(TIME_TO_SEC(aspace.totalTime)/3600) AS DECIMAL(10,1)) AS allocatedHours
                    FROM AllocSpace AS aspace
                    LEFT JOIN Space s ON aspace.spaceId = s.id
                    LEFT JOIN Subject sub ON aspace.subjectId = sub.id
                    WHERE sub.id = ? AND aspace.allocRound = ?
                    GROUP BY s.id
                    ;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [subjectId, allocId], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
/* Get subjects by Program.id and AllocRound.id */

const getSubjectsByProgram = (
  allocRound: number,
  programId: number,
): Promise<AllocatedSubjectsByProgramType> => {
  const sqlQuery = `
    SELECT alsub.subjectId AS "id", 
            sub.name,
            IFNULL(CAST(SUM(TIME_TO_SEC(alspace.totalTime) / 3600) AS DECIMAL(10,1)), 0) AS "allocatedHours",
            CAST((sub.groupCount * TIME_TO_SEC(sub.sessionLength) * sub.sessionCount / 3600) AS DECIMAL(10,1)) as "requiredHours"
    FROM AllocSubject alsub
    JOIN Subject sub ON alsub.subjectId = sub.id
    JOIN Program p ON sub.programId = p.id
    LEFT JOIN AllocSpace alspace ON alsub.subjectId = alspace.subjectId AND alsub.allocRound = alspace.allocRound
    WHERE p.id = ? AND alsub.allocRound = ?
    GROUP BY alsub.subjectId;`;
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

/* Get subjects by Room.id and AllocRound.id */

const getAllocatedSubjectsByRoom = (
  roomId: number,
  allocRound: number,
): Promise<string> => {
  const sqlQuery = `
    SELECT su.id, su.name, allocSp.totalTime FROM AllocSpace allocSp
    INNER JOIN Subject su ON su.id = allocSp.subjectId
    WHERE allocSp.spaceId = ? AND allocSp.allocRound = ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [roomId, allocRound], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/* START ALLOCATION - Procedure in database */
const startAllocation = (allocRound: number) => {
  const sqlQuery = 'CALL startAllocation(?)';
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

/* RESET ALLOCATION - Procedure in database */
const resetAllocation = (allocRound: number) => {
  const sqlQuery = 'CALL resetAllocation(?)';

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

/* ABORT ALLOCATION - Procedure in database */
const abortAllocation = (allocRound: number) => {
  const sqlQuery = 'CALL abortAllocation(?)';

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

//for test round 10004
const getUnAllocableSubjects = (allocRoundId = 10004): Promise<string> => {
  const sqlQuery = `SELECT all_sub.subjectId, s.name, s.groupSize, s.area, st.name AS "spaceType"
    FROM AllocSubject all_sub
    JOIN Subject s ON all_sub.subjectId = s.id
    JOIN SpaceType st ON s.spaceTypeId = st.id
    WHERE cantAllocate = 1
    AND allocRound = ?;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, allocRoundId, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

//work in progress
const getSpacesForSubject = (subjectId: number): Promise<string> => {
  const sqlQuery = `SELECT 
    s.id, 
    s.name, 
    s.area,
    getMissingItemAmount(?, s.id) AS "missingItems",
    IF(s.area >= (SELECT area FROM Subject WHERE id = ?), TRUE, FALSE) AS areaOk, 
    s.personLimit,
    IF(s.personLimit >= (SELECT groupSize FROM Subject WHERE id = ?), TRUE, FALSE) AS personLimitOk, 
    s.inUse,
    st.name as "spaceType",
    IF(st.id = (SELECT spaceTypeId FROM Subject WHERE id = ?), TRUE, FALSE) AS spaceTypeOk
    FROM Space s
    LEFT JOIN SpaceEquipment se ON s.id = se.spaceId
    LEFT JOIN SpaceType st ON s.spaceTypeId = st.id
    GROUP BY s.id
    ORDER BY FIELD(st.id, (SELECT spaceTypeId FROM Subject WHERE id = ?)) DESC,
    missingItems,
    personLimitOk DESC,
    areaOk DESC 
    ;`;
  return new Promise((resolve, reject) => {
    db.query(
      sqlQuery,
      [subjectId, subjectId, subjectId, subjectId, subjectId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

const getMissingEquipmentForRoom = (
  subjectId: number,
  spaceId: number,
): Promise<string> => {
  const sqlQuery = `SELECT equipmentId, e.name FROM SubjectEquipment sub_eq
    JOIN Equipment e ON sub_eq.equipmentId = e.id 
    WHERE subjectId = ?
        EXCEPT 
    SELECT equipmentId, e2.name FROM SpaceEquipment sp_eq
    JOIN Equipment e2 ON sp_eq.equipmentId = e2.id
        WHERE spaceId = ?;`;
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [subjectId, spaceId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export default {
  getAll,
  getById,
  getAllSubjectsById,
  getRoomsByAllocId,
  getSubjectsByProgram,
  getAllocatedRoomsByProgram,
  startAllocation,
  resetAllocation,
  getAllocatedRoomsBySubject,
  getUnAllocableSubjects,
  getSpacesForSubject,
  getMissingEquipmentForRoom,
  getAllocatedSubjectsByRoom,
  abortAllocation,
};
