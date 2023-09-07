import express from 'express';

import {
  dbErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import programService from '../services/program.js';
import allocationService from '../services/allocation.js';
import { authenticator } from '../authorization/userValidation.js';
import { admin } from '../authorization/admin.js';
import { planner } from '../authorization/planner.js';
import { statist } from '../authorization/statist.js';
import { roleChecker } from '../authorization/roleChecker.js';
import { validate } from '../validationHandler/index.js';

const allocation = express.Router();

/* Get rooms with allocated hours by allocationId */
allocation.get(
  '/:id/rooms',
  [authenticator, admin, planner, statist, roleChecker, validate],
  (req: any, res: any) => {
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
  },
);

/* Get all allocated rooms in programs by allocationId and program */
allocation.get(
  '/:id/program',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
        dbErrorHandler(
          req,
          res,
          err,
          'Oops! Nothing came through - Allocation',
        );
      });
  },
);

/* Get all allocated rooms by ProgramId, allocRound */
allocation.get(
  '/:id/rooms/:subjectId',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

/*gets unallocated subjects*/
allocation.get(
  '/:id/subject/unallocated',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

allocation.get(
  '/subject/:id/rooms',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

// eqpt = equipment
allocation.get(
  '/missing-eqpt/subject/:subid/room/:roomid',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
allocation.get(
  '/:id/subjects/:roomId',
  [authenticator, admin, planner, statist, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

/* Reset allocation = remove all subjects from allocSpace and reset isAllocated, prioritynumber and cantAllocate in allocSubject */
allocation.post(
  '/reset',
  [authenticator, admin, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

/* Abort allocation = Stop allocation procedure */
allocation.post(
  '/abort',
  [authenticator, admin, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

// Starting the allocation calculation!
allocation.post(
  '/start',
  [authenticator, admin, roleChecker, validate],
  async (req: any, res: any) => {
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
  },
);

export default allocation;
