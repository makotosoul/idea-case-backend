import db_knex from '../db/index_knex.js';
import {
  AllocatedRoomsByProgramType,
  AllocatedSubjectsByProgramType,
  RoomsByAllocId,
} from '../types/custom.js';

/* Get all the allocations */
const getAll = (): Promise<string> => {
  return db_knex
    .select('id', 'name', 'isSeasonAlloc', 'description', 'lastModified')
    .from('AllocRound as ar');
};

/* Get allocation by id */
const getById = async (allocRoundId: number): Promise<string> => {
  return db_knex
    .select(
      'ar.name',
      'ar.IsSeasonAlloc',
      'ar.description',
      'ar.lastModified',
      'ar.isAllocated',
      'ar.processOn',
      db_knex.raw(
        `COUNT(*) FROM AllocSubject WHERE AllocRound = ${allocRoundId} AS 'Subjects'`,
      ),
      db_knex.raw(
        `COUNT(*) FROM AllocSubject WHERE isAllocated = 1 AND AllocRound = ${allocRoundId} AS 'allocated'`,
      ),
    )
    .from('AllocRound')
    .where('ar.id', `${allocRoundId}`)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

// Get all subjects in allocation by id
const getAllSubjectsById = async (allocRoundId: number) => {
  return db_knex
    .select(
      's.id',
      's.name',
      'as2.isAllocated',
      'as2.cantAllocate',
      'as2.priority',
      db_knex.raw(
        `IFNULL((SELECT CAST(HOUR(al_sp.totalTime) + EXTRACT(MINUTE FROM al_sp.totalTime)/60) AS DECIMAL(10,2))
        FROM AllocSpace al_sp
        WHERE al_sp.allocRoundId = ${allocRoundId} AND al_sp.subjectId = s.id
        GROUP BY al_sp.subjectId), 0) AS "AllocatedHours",
        CAST(((HOUR(s.sessionLength) + EXTRACT(MINUTE FROM s.sessionLength)/60) * s.groupCount * s.sessionCount) AS DECIMAL(10,2)) AS "requiredHours"`,
      ),
    )
    .from('Subject as s')
    .innerJoin('AllocSubject as as2', 's.id', 'as2.subjectId')
    .innerJoin('AllocSpace as al_sp', 's.id', 'al_sp.subjectId')
    .where('as2.allocRoundId', allocRoundId)
    .groupBy('s.id')
    .orderBy('as2.priority', 'asc')
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

/* Get allocated rooms with allocatedHours */
const getRoomsByAllocId = (allocRoundId: number): Promise<RoomsByAllocId[]> => {
  return db_knex<RoomsByAllocId[]>('Space')
    .select('id', 'name')
    .select({
      allocatedHours: db_knex.raw(
        `(SELECT IFNULL(CAST(SUM(HOUR(as2.totalTime) + EXTRACT(MINUTE FROM as2.totalTime)/60) AS DECIMAL(10,2)), 0)
            FROM AllocSpace as as2
            WHERE spaceId = id
            AND allocRoundId = ?
        )`,
        [allocRoundId],
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
/*db_knex.raw(
  'TRUNCATE((EXTRACT(hour from as2.totalTime) + (extract(minute from as2.totalTime)/60)), 2) as hours',
  ), */
/* Get allocated rooms by Program.id and AllocRound.id */
const getAllocatedRoomsByProgram = async (
  programId: number,
  allocRoundId: number,
): Promise<AllocatedRoomsByProgramType> => {
  return db_knex
    .distinct(
      's.id',
      's.name',
      db_knex.raw(
        'CAST(SUM(HOUR(as2.totalTime) + EXTRACT(MINUTE FROM as2.totalTime)/60) AS DECIMAL(10,2)) AS allocatedHours',
      ),
    )
    .from('AllocSpace as as2')
    .leftJoin('Space as s', 'as2.spaceId', 's.id')
    .leftJoin('Subject as s2', 'as2.subjectId', 's2.id')
    .leftJoin('Program as p', 's2.programId', 'p.id')
    .where('p.id', programId)
    .andWhere('as2.allocRoundId', allocRoundId)
    .groupBy('s.id');
};

/* Get allocated rooms by Subject.id and AllocRound.id */
const getAllocatedRoomsBySubject = (
  subjectId: number,
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .distinct(
      's.id',
      's.name',
      db_knex.raw(
        'cast(sum(HOUR(aspace.totalTime) + EXTRACT(MINUTE FROM aspace.totalTime)/60) as decimal(10,2)) as allocatedHours',
      ),
    )
    .from('AllocSpace as aspace')
    .leftJoin('Space as s', 'aspace.spaceId', 's.id')
    .leftJoin('Subject as sub', 'aspace.subjectId', 'sub.id')
    .where('aspace.subjectId', subjectId)
    .andWhere('aspace.allocRoundId', allocRoundId)
    .groupBy('s.id');
};

/* Get subjects by Program.id and AllocRound.id */
const getSubjectsByProgram = (
  allocRoundId: number,
  programId: number,
): Promise<AllocatedSubjectsByProgramType> => {
  return db_knex
    .select(
      'alsub.subjectId as id',
      'sub.name',
      db_knex.raw(
        'IFNULL(CAST(SUM(HOUR(alspace.totalTime) + EXTRACT(MINUTE FROM alspace.totalTime)/60) as decimal(10,2)), 0) AS allocatedHours',
      ),
      db_knex.raw(
        'CAST((sub.groupCount * (HOUR(sub.sessionLength) + EXTRACT(MINUTE FROM sub.sessionLength)/60) * sub.sessionCount) AS DECIMAL(10,2)) as requiredHours',
      ),
    )
    .from('AllocSubject as alsub')
    .join('Subject as sub', 'alsub.subjectId', 'sub.id')
    .join('Program as p', 'sub.programId', 'p.id')
    .leftJoin('AllocSpace as alspace', function () {
      this.on('alsub.subjectId', 'alspace.subjectId').andOn(
        'alsub.allocRoundId',
        'alspace.allocRoundId',
      );
    })
    .where('p.id', programId)
    .andWhere('alsub.allocRoundId', allocRoundId)
    .groupBy('alsub.subjectId');
};

/* Get subjects by Room.id and AllocRound.id */
const getAllocatedSubjectsByRoom = async (
  roomId: number,
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .select(
      'su.id',
      'su.name',
      // EXTRACT(HOUR FROM ...) returns hours from 0 to 23 in certain MariaDB versions.
      // Use HOUR instead to get more than 24 hours. https://mariadb.com/kb/en/extract/
      db_knex.raw(
        'TRUNCATE((HOUR(allocSp.totalTime) + (EXTRACT(MINUTE FROM allocSp.totalTime) / 60)), 2) as totalTime',
      ),
    )
    .from('AllocSpace as allocSp')
    .innerJoin('Subject as su', 'su.id', 'allocSp.subjectId')
    .where('allocSp.spaceId', roomId)
    .andWhere('allocSp.allocRoundId', allocRoundId)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

/* START ALLOCATION - Procedure in database */
const startAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call startAllocation(${allocRoundId})`);
};

/* RESET ALLOCATION - Procedure in database */
const resetAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call resetAllocation(${allocRoundId})`);
};

/* ABORT ALLOCATION - Procedure in database */
const abortAllocation = (allocRoundId: number) => {
  return db_knex.raw(`call abortAllocation(${allocRoundId})`);
};

// No more just for test round 10004
const getUnAllocableSubjects = async (
  allocRoundId: number,
): Promise<string> => {
  return db_knex
    .select(
      'all_sub.subjectId',
      's.name',
      's.groupSize',
      's.area',
      'st.name as spaceType',
      's.allocRoundId',
    )
    .from('AllocSubject as all_sub')
    .join('Subject as s', 'all_sub.subjectId', 's.id')
    .join('SpaceType as st', 's.spaceTypeId', 'st.id')
    .where('cantAllocate', '1')
    .andWhere('s.allocRoundId', allocRoundId)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

const getSpacesForSubject = async (subjectId: number): Promise<string> => {
  return db_knex
    .select(
      's.id',
      's.name',
      's.area',
      db_knex.raw(`getMissingItemAmount(${subjectId}, s.id) as missingItems`),
      db_knex.raw(
        `IF(s.area >= (SELECT area FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS areaOk`,
      ),
      's.personLimit',
      db_knex.raw(
        `IF(s.personLimit >= (SELECT groupSize FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS personLimitOk`,
      ),
      's.inUse',
      'st.name as spaceType',
      db_knex.raw(
        `IF(st.id = (SELECT spaceTypeId FROM Subject WHERE id = ${subjectId}), TRUE, FALSE) AS spaceTypeOk`,
      ),
    )
    .from('Space as s')
    .leftJoin('SpaceEquipment as se', 's.id', 'se.spaceId')
    .leftJoin('SpaceType as st', 's.spaceTypeId', 'st.id')
    .groupBy('s.id')
    .orderByRaw(
      `FIELD(st.id, (SELECT spaceTypeId FROM Subject WHERE id = ${subjectId})) DESC`,
    )
    .orderBy([
      { column: 'missingItems' },
      { column: 'personLimitOk', order: 'desc' },
      { column: 'areaOk', order: 'desc' },
    ])
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

const getMissingEquipmentForRoom = async (
  subjectId: number,
  spaceId: number,
): Promise<string> => {
  return db_knex
    .select('e.id', 'e.name')
    .from('SubjectEquipment as sub_eq')
    .join('Equipment as e', 'sub_eq.equipmentId', 'e.id')
    .where('subjectId', subjectId)
    .except(
      db_knex
        .select('e2.id', 'e2.name')
        .from('SpaceEquipment as sp_eq')
        .join('Equipment as e2', 'sp_eq.equipmentId', 'e2.id')
        .where('spaceId', spaceId),
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
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
