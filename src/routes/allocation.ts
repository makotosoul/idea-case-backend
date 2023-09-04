import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import programService from '../services/program.js';
import allocationService from '../services/allocation.js';
//import { ProgramAllocation } from '../types.js';

const allocation = express.Router();

/* Get allocation by id */

allocation.get('/:id', async (req, res) => {
  db_knex('AllocRound')
    .select()
    .where('id', req.params.id)
    .then((data) => {
      successHandler(req, res, data, 'Successfully read the buildings from DB');
    })
    .catch((err) => {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Building');
    });
});

/* Get rooms with allocated hours by allocationId */

allocation.get('/:id/rooms', (req, res) => {
  const id = req.params.id;
  allocationService
    .getRoomsByAllocId(Number(id))
    .then((data) => {
      successHandler(req, res, data, 'getById succesful - Allocation');
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Nothing came through - Allocation getById',
      );
    });
});

/* Get all allocated rooms in programs by allocationId and program */

allocation.get('/:id/program', async (req, res) => {
  const id = req.params.id;
  programService
    .getAll()
    .then(async (programs) => {
      return await Promise.all(
        programs.map(async (program) => {
          let rooms = await allocationService.getAllocatedRoomsByProgram(
            program.id,
            Number(id),
          );
          let subjects = await allocationService.getSubjectsByProgram(
            Number(id),
            program.id,
          );
          return {
            ...program,
            rooms,
            subjects,
          };
        }),
      );
    })
    .then((data) => {
      successHandler(
        req,
        res,
        data,
        'getRoomsByProgram succesful - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(req, res, err, 'Oops! Nothing came through - Allocation');
    });
});

/* Get all allocated rooms by ProgramId, allocRound */
allocation.get('/:id/rooms/:subjectId', async (req, res) => {
  const allocId = req.params.id;
  const subjectId = req.params.subjectId;
  const rooms = await allocationService
    .getAllocatedRoomsBySubject(Number(subjectId), Number(allocId))
    .then((rooms) => {
      successHandler(
        req,
        res,
        rooms,
        'getRoomsBySubject succesful - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Allocation reset failed - Allocation',
      );
    });

  return rooms;
});

/*gets unallocated subjects*/
allocation.get('/:id/subject/unallocated', async (req, res) => {
  const allocId = req.params.id;
  await allocationService
    .getUnAllocableSubjects(Number(allocId))
    .then((data) => {
      successHandler(
        req,
        res,
        data,
        'Unallocated subjects returned - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(req, res, err, 'Oops! Failure - unAllocated');
    });
});

allocation.get('/subject/:id/rooms', async (req, res) => {
  const subjectId = req.params.id;
  await allocationService
    .getSpacesForSubject(Number(subjectId))
    .then((data) => {
      successHandler(req, res, data, 'Get Spaces for subject - Allocation');
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Failed get spaces for subject - unAllocated',
      );
    });
});

// eqpt = equipment
allocation.get(
  '/missing-eqpt/subject/:subid/room/:roomid',
  async (req, res) => {
    const subjectId = req.params.subid;
    const spaceId = req.params.roomid;
    await allocationService
      .getMissingEquipmentForRoom(Number(subjectId), Number(spaceId))
      .then((data) => {
        successHandler(
          req,
          res,
          data,
          'Missing Equipment for Room - Allocation',
        );
      })
      .catch((err) => {
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Failed get equipments for the room - Allocation',
        );
      });
  },
);

/* Get all allocated rooms by RoomId, allocRound */
allocation.get('/:id/subjects/:roomId', async (req, res) => {
  const allocId = req.params.id;
  const roomId = req.params.roomId;
  const subjects = await allocationService
    .getAllocatedSubjectsByRoom(Number(roomId), Number(allocId))
    .then((subs) => {
      successHandler(
        req,
        res,
        subs,
        'getAllocatedSubjectsByRoom succesful - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Allocation reset failed - Allocation',
      );
    });

  return subjects;
});

/* Reset allocation = remove all subjects from allocSpace and reset isAllocated, prioritynumber and cantAllocate in allocSubject */
allocation.post('/reset', async (req, res) => {
  const allocRound = req.body.allocRound;
  if (!allocRound) {
    return validationErrorHandler(
      req,
      res,
      'Missing required parameter - allocation reset',
    );
  }
  allocationService
    .resetAllocation(allocRound)
    .then(() => {
      successHandler(
        req,
        res,
        'reset completed',
        'Allocation reset completed - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Allocation reset failed - Allocation',
      );
    });
});

/* Abort allocation = Stop allocation procedure */
allocation.post('/abort', async (req, res) => {
  const allocRound = req.body.allocRound;
  if (!allocRound) {
    return validationErrorHandler(
      req,
      res,
      'Missing required parameter - allocation reset',
    );
  }
  allocationService
    .abortAllocation(allocRound)
    .then(() => {
      successHandler(
        req,
        res,
        'Aborting...',
        'Allocation abort completed - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Allocation abort failed - Allocation',
      );
    });
});

// Starting the allocation calculation!
allocation.post('/start', async (req, res) => {
  const allocRound = req.body.allocRound;
  if (!allocRound) {
    return validationErrorHandler(
      req,
      res,
      'Missing required parameter - allocation start',
    );
  }

  allocationService
    .startAllocation(allocRound)
    .then(() => {
      successHandler(
        req,
        res,
        'Allocation completed',
        'Allocation succesful - Allocation',
      );
    })
    .catch((err) => {
      dbErrorHandler(
        req,
        res,
        err,
        'Oops! Allocation failed - Allocation start',
      );
    });
});

export default allocation;
