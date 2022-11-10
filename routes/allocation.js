const express = require("express");
const allocation = express.Router();
const {
  dbErrorHandler,
  successHandler,
  validationErrorHandler,
} = require("../responseHandler/index");

const programService = require("../services/program");
const allocationService = require("../services/allocation");

/* Get all allocations */

allocation.get("", (req, res) => {
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

allocation.get("/:id", async (req, res) => {
  await allocationService
    .getById(req.params.id)
    .then(async (data) => {
      return (data[0] = {
        ...data[0],
        subjects: await allocationService.getAllSubjectsById(data[0].id),
        rooms: await allocationService.getRoomsByAllocId(data[0].id),
      });
    })
    .then(async (data) => {
      await Promise.all(
        data.subjects.map(async (subject, index) => {
          data.subjects[index] = {
            ...subject,
            rooms: await allocationService.getRoomsBySubjectAndAllocRound(
              subject.id,
              data.id,
            ),
          };
        }),
        data.rooms.map(async (room, index) => {
          data.rooms[index] = {
            ...room,
            subjects: await allocationService.getSubjectsByAllocRoundAndSpaceId(
              data.id,
              room.id,
            ),
          };
        }),
      );
      return data;
    })
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

/* Get all allocated rooms in programs by allocationId and program */

allocation.get("/:id/program", async (req, res) => {
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
          subjects: await allocationService.getSubjectsByProgram(
            id,
            program.id,
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

/* Get all allocated rooms by ProgramId, allocRound */
allocation.get("/:id/program/:programId", async (req, res) => {
  const allocId = req.params.id;
  const programId = req.params.programId;
  programService
    .getById(programId)
    .then(async (program) => {
      if (program[0]) {
        program[0] = {
          ...program[0],
          rooms: await allocationService.getAllocatedRoomsByProgram(
            programId,
            allocId,
          ),
          subjects: await allocationService.getSubjectsByProgram(
            allocId,
            programId,
          ),
        };
      }
      return program;
    })
    .then((data) => {
      successHandler(res, data, "getRoomsByProgram succesful - Allocation");
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Oops! Nothing came through - Allocation");
    });
});

/* Reset allocation = remove all subjects from allocSpace and reset isAllocated, prioritynumber and cantAllocate in allocSubject */
allocation.post("/reset", async (req, res) => {
  const allocRound = req.body.allocRound;
  if (!allocRound) {
    return validationErrorHandler(
      res,
      "Missing required parameter - allocation reset",
    );
  }
  allocationService
    .resetAllocation(allocRound)
    .then(() => {
      successHandler(
        res,
        "reset completed",
        "Allocation reset completed - Allocation",
      );
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Oops! Allocation reset failed - Allocation");
    });
});

// Allokointilaskennan aloitus - KESKEN!
allocation.post("/start", async (req, res) => {
  const allocRound = req.body.allocRound;
  if (!allocRound) {
    return validationErrorHandler(
      res,
      "Missing required parameter - allocation start",
    );
  }

  allocationService
    .startAllocation(allocRound)
    .then(() => {
      successHandler(
        res,
        "Allocation completed",
        "Allocation succesful - Allocation",
      );
    })
    .catch((err) => {
      dbErrorHandler(res, err, "Oops! Allocation failed - Allocation start");
    });
});

module.exports = allocation;
