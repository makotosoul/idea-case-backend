const express = require("express");
const subjectequipment = express.Router();
//import db from ("../db/index");
const db = require("../db/index");
const logger = require("../utils/logger");
const {
  dbErrorHandler,
  successHandler,
  requestErrorHandler,
  validationErrorHandler,
} = require("../responseHandler/index");
const { body, validationResult } = require("express-validator");
const {
  validateAddUpdateSubjectEquipment,
} = require("../validationHandler/index");

// Varusteet opetus id perusteella
subjectequipment.get("/getEquipment/:subjectId", (req, res) => {
  const subjectId = req.params.subjectId;
  const sqlGetEquipmentBySubjectId =
    "SELECT se.subjectId , e.name,e.description, se.equipmentId FROM Subjectequipment se JOIN Equipment e ON se.equipmentId = e.id WHERE se.subjectid = ?;";
  db.query(sqlGetEquipmentBySubjectId, subjectId, (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Nothing came through - SubjectEquipment");
    } else {
      successHandler(res, result, "getEquipment successful - SubjectEquipment");
    }
  });
});

// Varusteen lisäys opetukseen
subjectequipment.post(
  "/post",
  validateAddUpdateSubjectEquipment,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Validation error:  %O", errors);
    }
    if (!errors.isEmpty()) {
      return validationErrorHandler(res, "Formatting problem");
    }
    const subjectId = req.body.subjectId;
    const equipmentId = req.body.equipmentId;
    const priority = req.body.priority;
    const obligatory = req.body.obligatory;
    const sqlInsert =
      "INSERT INTO subjectequipment (subjectId, equipmentId, priority, obligatory) VALUES (?,?,?,?)";
    db.query(
      sqlInsert,
      [subjectId, equipmentId, priority, obligatory],
      (err, result) => {
        if (!result) {
          requestErrorHandler(res, err, "Nothing to insert");
        } else if (err) {
          dbErrorHandler(res, err, "Oops! Create failed - SubjectEquipment");
        } else {
          successHandler(
            res,
            { insertId: result.insertId },
            "Create successful - SubjectEquipment",
          );
          logger.info(
            `SubjectEquipment created for subjectId ${req.body.subjectId}`,
          );
        }
      },
    );
  },
);

// Varusteen poisto
subjectequipment.delete("/delete/:subjectId/:equipmentId", (req, res) => {
  const subjectId = req.params.subjectId;
  const equipmentId = req.params.equipmentId;
  const sqlDelete =
    "DELETE FROM SubjectEquipment WHERE subjectId = ? AND equipmentId = ?;";
  db.query(sqlDelete, [subjectId, equipmentId], (err, result) => {
    if (err) {
      dbErrorHandler(res, err, "Oops! Delete failed - SubjectEquipment");
    } else {
      successHandler(res, result, "Delete successful - SubjectEquipment");
      logger.info("SubjectEquipment deleted");
    }
  });
});

module.exports = subjectequipment;
