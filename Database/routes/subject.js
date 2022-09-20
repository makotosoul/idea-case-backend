const express = require("express");
const subject = express.Router();
const db = require("../db/index");
const logger = require("../utils/logger");
const {
  dbErrorHandler,
  succsessHandler,
  requestErrorHandler,
} = require("../responseHandler/index");

// Aineen kaikki tiedot sekä pääaineen id ja nimi
subject.get("/getAll", (req, res) => {
  const sqlSelectSubjectProgram =
    "SELECT subject.id, subject.name AS subjectName, subject.groupSize, subject.groupCount, subject.sessionLength, subject.sessionCount, subject.area, subject.programId, program.name FROM Subject  JOIN Program ON subject.programId = program.id";
  db.query(sqlSelectSubjectProgram, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - Subject");
    } else {
      succsessHandler(res, result, "getAll succsesfull - Subject");
    }
  });
});

// Aineen lisäys
subject.post("/post", (req, res) => {
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
    [name, groupSize, groupCount, sessionLength, sessionCount, area, programId],
    (err, result) => {
      if (!result) {
        requestErrorHandler(res, "Nothing to insert");
      } else if (err) {
        dbErrorHandler(res, err, "Oops! Create failed - Subject");
      } else {
        succsessHandler(res, result, "Create succsesfull - Subject");
        logger.info("Subject created");
      }
    },
  );
});

// Aineen poisto
subject.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  const sqlDelete = "DELETE FROM Subject WHERE id = ?;";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Delete failed - Subject");
    } else {
      succsessHandler(res, result, "Delete succsesfull - Subject");
      logger.info("Subject deleted");
    }
  });
});

// Aineen päivitys
subject.put("/update", (req, res) => {
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
        requestErrorHandler(res, "Nothing to update");
      } else if (err) {
        dbErrorHandler(res, err, "Oops! Update failed - Subject");
      } else {
        succsessHandler(res, result, "Update succsesfull - Subject");
        logger.info("Subject updated");
      }
    },
  );
});

module.exports = subject;
