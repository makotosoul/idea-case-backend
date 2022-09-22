const express = require("express");
const subject = express.Router();
const db = require("../db/index");
const logger = require("../utils/logger");
const {
  dbErrorHandler,
  succsessHandler,
  requestErrorHandler,
  validationErrorHandler,
} = require("../responseHandler/index");
const { body, validationResult } = require("express-validator");

// Aineen kaikki tiedot sekä pääaineen id ja nimi
subject.get("/getAll", (req, res) => {
  const sqlSelectSubjectProgram =
    "SELECT subject.id, subject.name AS subjectName, subject.groupSize, subject.groupCount, subject.sessionLength, subject.sessionCount, subject.area, subject.programId, program.name FROM Subject  JOIN Program ON subject.programId = program.id";
  db.query(sqlSelectSubjectProgram, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Subject");
    } else {
      succsessHandler(res, result, "getAll successful - Subject");
    }
  });
});

// Aineen lisäys
subject.post(
  "/post",
  body("name")
    .toLowerCase()
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2-255 characters long")
    .bail()
    .matches(/^[a-zAz\u00c0-\u017e]{1,255}$/)
    .withMessage("Must contain only letters")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("groupSize")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("groupCount")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("sessionLength")
    .matches(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/)
    .withMessage("Accepted format: 00:00")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("area")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error:  %O", errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, "Formatting problem");
    }
    const name = req.body.name;
    const groupSize = req.body.groupSize;
    const groupCount = req.body.groupCount;
    const sessionLength = req.body.sessionLength;
    const sessionCount = req.body.sessionCount;
    const area = req.body.area;
    const programId = req.body.programId;
    const sqlInsert =
      "INSERT INTO Subject (name, groupSize, groupCount, sessionLength, sessionCount, area, programId) VALUES (?,?,?,?,?,?,?)";
    db.query(
      sqlInsert,
      [
        name,
        groupSize,
        groupCount,
        sessionLength,
        sessionCount,
        area,
        programId,
      ],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, err, "Nothing to insert");
        } else if (err) {
          dbErrorHandler(res, err, "Oops! Create failed - Subject");
        } else {
          succsessHandler(res, result, "Create successful - Subject");
          logger.info("Subject created");
        }
      },
    );
  },
);

// Aineen poisto
subject.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  const sqlDelete = "DELETE FROM Subject WHERE id = ?;";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Delete failed - Subject");
    } else {
      succsessHandler(res, result, "Delete successful - Subject");
      logger.info("Subject deleted");
    }
  });
});

// Aineen päivitys
subject.put(
  "/update",
  body("name")
    .toLowerCase()
    .isLength({ min: 2, max: 255 })
    .withMessage("Must be between 2-255 characters long")
    .bail()
    .matches(/^[a-zAz\u00c0-\u017e]{1,255}$/)
    .withMessage("Must contain only letters")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("groupSize")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("groupCount")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("sessionLength")
    .matches(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/)
    .withMessage("Accepted format: 00:00")
    .bail()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),
  body("area")
    .matches(/\d/)
    .withMessage("Must be a number")
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage("Cannot be empty")
    .bail(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error:  %O", errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, "Formatting problem");
    }
    const name = req.body.name;
    const groupSize = req.body.groupSize;
    const groupCount = req.body.groupCount;
    const sessionLength = req.body.sessionLength;
    const sessionCount = req.body.sessionCount;
    const area = req.body.area;
    const sqlUpdate =
      "UPDATE Subject SET name = ?, groupSize = ?, groupCount = ?, sessionLength = ?, sessionCount = ?, area = ? WHERE id = ?";
    db.query(
      sqlUpdate,
      [name, groupSize, groupCount, sessionLength, sessionCount, area],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, err, "Nothing to update");
        } else if (err) {
          dbErrorHandler(res, err, "Oops! Update failed - Subject");
        } else {
          succsessHandler(res, result, "Update successful - Subject");
          logger.info("Subject updated");
        }
      },
    );
  },
);

module.exports = subject;
