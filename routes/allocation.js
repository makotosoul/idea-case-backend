const express = require("express");
const allocation = express.Router();
const { dbErrorHandler, successHandler } = require("../responseHandler/index");

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

allocation.post("/start", (req, res) => {
  const allocRound = req.body.allocRound;
  allocationService
    .getPriorityOrder(allocRound)
    .then(async (data) => {
      for ([index, subject] of await data.entries()) {
        allocationService.updateAllocSubjectPriority(
          subject.subjectId,
          subject.allocRound,
          index + 1,
        );
      }
      console.log("done");
      res.status(200);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = allocation;
